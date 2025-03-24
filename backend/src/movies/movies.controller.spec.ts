import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: jest.Mocked<MoviesService>;

  const mockMovie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 120,
    rating: 8.8,
    releaseYear: 2010,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByTitle: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(MoviesController);
    service = module.get(MoviesService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all movies', async () => {
    service.findAll.mockResolvedValue([mockMovie]);
    const result = await controller.findAll();
    expect(result).toEqual([mockMovie]);
  });

  it('should create a valid movie', async () => {
    service.create.mockResolvedValue(mockMovie);
    const result = await controller.create({ ...mockMovie });
    expect(result).toEqual(mockMovie);
  });

  it('should throw for missing movie title on create', async () => {
    await expect(controller.create({ genre: 'Drama' } as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw for missing movie genre on create', async () => {
    await expect(controller.create({ title: 'Title' } as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw for missing movie duration on create', async () => {
    await expect(controller.create({ title: 'Title', genre: 'Drama' } as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw for missing movie rating on create', async () => {
    await expect(controller.create({ ...mockMovie, rating: undefined })).rejects.toThrow(BadRequestException);
  });

  it('should throw for missing releaseYear on create', async () => {
    await expect(controller.create({ ...mockMovie, releaseYear: undefined })).rejects.toThrow(BadRequestException);
  });

  it('should throw for non-numeric duration', async () => {
    await expect(controller.create({ ...mockMovie, duration: 'abc' as any })).rejects.toThrow(BadRequestException);
  });

  it('should throw for non-numeric rating', async () => {
    await expect(controller.create({ ...mockMovie, rating: 'high' as any })).rejects.toThrow(BadRequestException);
  });

  it('should throw for non-numeric releaseYear', async () => {
    await expect(controller.create({ ...mockMovie, releaseYear: 'future' as any })).rejects.toThrow(BadRequestException);
  });

  it('should throw for negative movie duration', async () => {
    await expect(controller.create({ ...mockMovie, duration: -10 })).rejects.toThrow(BadRequestException);
  });

  it('should throw for movie rating over 10', async () => {
    await expect(controller.create({ ...mockMovie, rating: 11 })).rejects.toThrow(BadRequestException);
  });

  it('should throw for movie rating below 0', async () => {
    await expect(controller.create({ ...mockMovie, rating: -1 })).rejects.toThrow(BadRequestException);
  });

  it('should throw for release year too old (Before 1900)', async () => {
    await expect(controller.create({ ...mockMovie, releaseYear: 1800 })).rejects.toThrow(BadRequestException);
  });

  it('should throw for release year in the future (Later than current year)', async () => {
    const futureYear = new Date().getFullYear() + 1;
    await expect(controller.create({ ...mockMovie, releaseYear: futureYear })).rejects.toThrow(BadRequestException);
  });

  it('should update movie by title', async () => {
    service.findByTitle.mockResolvedValue(mockMovie);
    const updated = { ...mockMovie, duration: 130 };
    const result = await controller.updateByTitle('Inception', updated);
    expect(result).toEqual(updated);
  });

  it('should throw if movie to update not found', async () => {
    service.findByTitle.mockResolvedValue(null);
    await expect(controller.updateByTitle('Unknown', mockMovie)).rejects.toThrow(NotFoundException);
  });

  it('should delete movie by title', async () => {
    service.findByTitle.mockResolvedValue(mockMovie);
    await controller.deleteByTitle('Inception');
    expect(service.delete).toHaveBeenCalledWith(mockMovie.id);
  });

  it('should throw if movie to delete not found', async () => {
    service.findByTitle.mockResolvedValue(null);
    await expect(controller.deleteByTitle('Unknown')).rejects.toThrow(NotFoundException);
  });

  it('should return movie by ID', async () => {
    service.findOne.mockResolvedValue(mockMovie);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockMovie);
  });

  it('should throw if movie by ID not found', async () => {
    service.findOne.mockResolvedValue(null);
    await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
  });
});
