import { Test, TestingModule } from '@nestjs/testing';
import { TheatersService } from './theaters.service';
import { Theater } from './theater.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TheatersService', () => {
  let service: TheatersService;
  let repo: Repository<Theater>;

  const mockTheaterRepository = {
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TheatersService,
        {
          provide: getRepositoryToken(Theater),
          useValue: mockTheaterRepository,
        },
      ],
    }).compile();

    service = module.get<TheatersService>(TheatersService);
    repo = module.get<Repository<Theater>>(getRepositoryToken(Theater));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all theaters', async () => {
    const mockTheaters = [{ id: 1, name: 'Main Hall' }] as Theater[];
    mockTheaterRepository.find.mockResolvedValue(mockTheaters);

    const result = await service.findAll();
    expect(result).toEqual(mockTheaters);
    expect(mockTheaterRepository.find).toHaveBeenCalled();
  });

  it('should create a theater', async () => {
    const input = { name: 'New Theater', numberOfRows: 5, numberOfColumns: 10 };
    const saved = { id: 1, ...input };
    mockTheaterRepository.save.mockResolvedValue(saved);

    const result = await service.create(input);
    expect(result).toEqual(saved);
    expect(mockTheaterRepository.save).toHaveBeenCalledWith(input);
  });

  it('should find a theater by ID', async () => {
    const mockTheater = { id: 1, name: 'Found Theater' } as Theater;
    mockTheaterRepository.findOne.mockResolvedValue(mockTheater);

    const result = await service.findOne(1);
    expect(result).toEqual(mockTheater);
    expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a theater', async () => {
    const updateData = { name: 'Updated Theater', numberOfRows: 10, numberOfColumns: 15 };
    mockTheaterRepository.findOne.mockResolvedValue({ id: 1, ...updateData });
    mockTheaterRepository.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(1, updateData);
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw NotFoundException when updating non-existent theater', async () => {
    mockTheaterRepository.findOne.mockResolvedValue(null);

    await expect(service.update(1, { name: 'Fail' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a theater', async () => {
    mockTheaterRepository.findOne.mockResolvedValue({ id: 1 });
    mockTheaterRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.delete(1);
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw NotFoundException when deleting non-existent theater', async () => {
    mockTheaterRepository.findOne.mockResolvedValue(null);

    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });
});
