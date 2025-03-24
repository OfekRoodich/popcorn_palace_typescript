import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { Movie } from '../movies/movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let movieRepo: jest.Mocked<Repository<Movie>>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: getRepositoryToken(Showtime), useFactory: mockRepository },
        { provide: getRepositoryToken(Movie), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get(ShowtimesService);
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 120,
    rating: 8.8,
    releaseYear: 2010,
  };

  const validShowtime = {
    theater: 'Main Hall',
    price: 25,
    movieId: 1,
    startTime: new Date(Date.now() + 3600000),
  };

  it('should create a showtime successfully', async () => {
    movieRepo.findOne.mockResolvedValue(mockMovie);
    showtimeRepo.create.mockReturnValue({ id: 1 } as Showtime);
    showtimeRepo.save.mockResolvedValue({ id: 1 } as Showtime);
    mockQueryBuilder.getCount.mockResolvedValue(0);

    const result = await service.create(validShowtime);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });

  it('should throw if movie is not found', async () => {
    movieRepo.findOne.mockResolvedValue(null);

    await expect(service.create(validShowtime)).rejects.toThrow(BadRequestException);
  });

  it('should throw if there is an overlapping showtime', async () => {
    movieRepo.findOne.mockResolvedValue(mockMovie);
    mockQueryBuilder.getCount.mockResolvedValue(1);

    await expect(service.create(validShowtime)).rejects.toThrow(BadRequestException);
  });

  it('should update a showtime successfully', async () => {
    const updatedShowtime = { ...validShowtime, price: 30 };

    showtimeRepo.findOne.mockResolvedValue({
      id: 1,
      movie: mockMovie,
      theater: updatedShowtime.theater,
      startTime: updatedShowtime.startTime,
      endTime: new Date(updatedShowtime.startTime.getTime() + mockMovie.duration * 60000),
      price: 25,
    } as Showtime);

    movieRepo.findOne.mockResolvedValue(mockMovie);
    showtimeRepo.update.mockResolvedValue({} as any);
    mockQueryBuilder.getCount.mockResolvedValue(0);
    showtimeRepo.findOne.mockResolvedValue({
      id: 1,
      movie: mockMovie,
      theater: updatedShowtime.theater,
      startTime: updatedShowtime.startTime,
      endTime: new Date(updatedShowtime.startTime.getTime() + mockMovie.duration * 60000),
      price: updatedShowtime.price,
    } as Showtime);

    const result = await service.update(1, updatedShowtime);
    expect(result).toEqual(expect.objectContaining({ id: 1, price: 30 }));
  });

  it('should throw if updating a non-existent showtime', async () => {
    showtimeRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.update(999, validShowtime)).rejects.toThrow(BadRequestException);
  });

  it('should throw if movie Id during update is invalid', async () => {
    showtimeRepo.findOne.mockResolvedValue({
      id: 1,
      movie: mockMovie,
      theater: validShowtime.theater,
      startTime: validShowtime.startTime,
      endTime: new Date(validShowtime.startTime.getTime() + mockMovie.duration * 60000),
      price: validShowtime.price,
    } as Showtime);
    movieRepo.findOne.mockResolvedValue(null);

    await expect(service.update(1, { ...validShowtime, movieId: 999 })).rejects.toThrow(BadRequestException);
  });

  it('should delete a showtime', async () => {
    await service.delete(1);
    expect(showtimeRepo.delete).toHaveBeenCalledWith(1);
  });
});