import { Test, TestingModule } from '@nestjs/testing';
import { TheatersService } from './theaters.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Theater } from './theater.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TheatersService', () => {
  let service: TheatersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TheatersService,
        {
          provide: getRepositoryToken(Theater),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TheatersService>(TheatersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all theaters', async () => {
    const theaters = [{ id: 1, name: 'Test', numberOfRows: 3, numberOfColumns: 5 }];
    mockRepo.find.mockResolvedValue(theaters);
    const result = await service.findAll();
    expect(result).toEqual(theaters);
  });

  it('should throw for invalid ID in findOne', async () => {
    await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
  });

  it('should throw if theater not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should return theater by ID', async () => {
    const theater = { id: 1, name: 'T1', numberOfRows: 5, numberOfColumns: 5 };
    mockRepo.findOne.mockResolvedValue(theater);
    const result = await service.findOne(1);
    expect(result).toEqual(theater);
  });

  it('should create a theater', async () => {
    const newTheater = { name: 'T1', numberOfRows: 5, numberOfColumns: 5 };
    mockRepo.save.mockResolvedValue({ id: 1, ...newTheater });
    const result = await service.create(newTheater);
    expect(result).toEqual({ id: 1, ...newTheater });
  });

  it('should throw for empty theater name on create', async () => {
    await expect(
      service.create({ name: '', numberOfRows: 5, numberOfColumns: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw for invalid numberOfRows on create', async () => {
    await expect(
      service.create({ name: 'T1', numberOfRows: 0, numberOfColumns: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw for invalid numberOfColumns on create', async () => {
    await expect(
      service.create({ name: 'T1', numberOfRows: 5, numberOfColumns: -1 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update a theater', async () => {
    const updated = { name: 'Updated Theater', numberOfRows: 5, numberOfColumns: 6 };
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    mockRepo.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(1, updated);
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw NotFoundException if theater does not exist on update', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.update(1, { name: 'Updated' })).rejects.toThrow(NotFoundException);
  });

  it('should throw for empty name on update', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.update(1, { name: '   ' })).rejects.toThrow(BadRequestException);
  });

  it('should throw for invalid numberOfRows on update', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.update(1, { name: 'Valid', numberOfRows: 0 }))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw for invalid numberOfColumns on update', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.update(1, { name: 'Valid', numberOfColumns: -1 }))
      .rejects.toThrow(BadRequestException);
  });

  it('should delete a theater', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    mockRepo.delete.mockResolvedValue({ affected: 1 });

    const result = await service.delete(1);
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw BadRequestException for invalid ID on delete', async () => {
    await expect(service.delete(0)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if theater not found on delete', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should call delete with correct ID', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    mockRepo.delete.mockResolvedValue({ affected: 1 });

    await service.delete(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should allow valid undefined numberOfRows on update', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    mockRepo.update.mockResolvedValue({ affected: 1 });
  
    // numberOfRows is undefined — should skip validation
    const result = await service.update(1, { name: 'Updated' });
    expect(result).toEqual({ affected: 1 });
  });

  
});
