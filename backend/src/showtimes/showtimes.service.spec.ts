import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { Theater } from '../theaters/theater.entity';
import { Movie } from '../movies/movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let theaterRepo: jest.Mocked<Repository<Theater>>;
  let movieRepo: jest.Mocked<Repository<Movie>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: getRepositoryToken(Showtime), useFactory: mockRepository },
        { provide: getRepositoryToken(Theater), useFactory: mockRepository },
        { provide: getRepositoryToken(Movie), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get(ShowtimesService);
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    theaterRepo = module.get(getRepositoryToken(Theater));
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  function mockOverlap(count: number) {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(count),
    };
    (showtimeRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);
  }

  it('should return all showtimes with movie and theater', async () => {
    const showtimes = [{ id: 1 } as Showtime];
    showtimeRepo.find.mockResolvedValue(showtimes);

    const result = await service.findAll();
    expect(result).toBe(showtimes);
  });

  it('should create a showtime successfully', async () => {
    const theater = { id: 1, numberOfRows: 2, numberOfColumns: 2 };
    const movie = { id: 1, duration: 90 };
    const data = { theaterId: 1, movieId: 1, startTime: new Date(), price: 20 };

    mockOverlap(0);

    theaterRepo.findOne.mockResolvedValue(theater as Theater);
    movieRepo.findOne.mockResolvedValue(movie as Movie);
    showtimeRepo.create.mockReturnValue({ id: 1 } as Showtime);
    showtimeRepo.save.mockResolvedValue({ id: 1 } as Showtime);
    showtimeRepo.findOne.mockResolvedValue({ id: 1 } as Showtime);

    const result = await service.create(data);
    expect(result.id).toBe(1);
  });

  it('should throw error if theater not found', async () => {
    theaterRepo.findOne.mockResolvedValue(null);
    await expect(service.create({ theaterId: 1 } as any)).rejects.toThrow('Theater not found');
  });

  it('should throw BadRequestException on overlapping showtime', async () => {
    const theater = { id: 1, numberOfRows: 2, numberOfColumns: 2 };
    const movie = { id: 1, duration: 90 };
    const data = { theaterId: 1, movieId: 1, startTime: new Date(), price: 20 };

    mockOverlap(1);

    theaterRepo.findOne.mockResolvedValue(theater as Theater);
    movieRepo.findOne.mockResolvedValue(movie as Movie);
    showtimeRepo.create.mockReturnValue({} as Showtime);
    showtimeRepo.save.mockImplementation(() => {
      throw new Error('❌ save should not be called');
    });

    await expect(service.create(data)).rejects.toThrow(BadRequestException);
    expect(showtimeRepo.save).not.toHaveBeenCalled();
  });

  it('should throw error when changing theater with booked tickets', async () => {
    showtimeRepo.findOne.mockResolvedValue({
      id: 1,
      theater: { id: 1 },
      movie: { id: 1 },
      bookedCount: 5,
    } as Showtime);

    await expect(service.update(1, { theaterId: 2 })).rejects.toThrow(
      '⚠️ Cannot change theater for a showtime with booked tickets.'
    );
  });

  it('should update showtime movie and startTime and recalculate endTime', async () => {
    const existing = {
      id: 1,
      startTime: new Date(),
      movie: { id: 1, duration: 100 },
      theater: { id: 1 },
      bookedCount: 0,
    } as Showtime;

    const newMovie = { id: 2, duration: 120 } as Movie;
    const updatedStart = new Date('2025-04-01T15:00:00');

    showtimeRepo.findOne.mockResolvedValue(existing);
    movieRepo.findOne.mockResolvedValue(newMovie);
    mockOverlap(0);

    await service.update(1, {
      movieId: 2,
      startTime: updatedStart,
    });

    expect(showtimeRepo.update).toHaveBeenCalledWith(1, expect.objectContaining({
      movie: { id: 2 },
      startTime: updatedStart,
      endTime: new Date(updatedStart.getTime() + 120 * 60000),
    }));
  });

  it('should update theater if no tickets are booked', async () => {
    const existing = {
      id: 1,
      startTime: new Date(),
      movie: { id: 1, duration: 100 },
      theater: { id: 1 },
      bookedCount: 0,
    } as Showtime;

    const newTheater = { id: 2, numberOfRows: 2, numberOfColumns: 2 } as Theater;

    showtimeRepo.findOne.mockResolvedValue(existing);
    theaterRepo.findOne.mockResolvedValue(newTheater);
    mockOverlap(0);

    await service.update(1, { theaterId: 2 });

    expect(showtimeRepo.update).toHaveBeenCalledWith(1, expect.objectContaining({
      theater: { id: 2 },
      seatMatrix: [[0, 0], [0, 0]],
      bookedCount: 0,
    }));
  });

  it('should throw if trying to book already-booked seat', async () => {
    showtimeRepo.findOne.mockResolvedValue({
      id: 1,
      seatMatrix: [[0, 2], [0, 0]],
    } as Showtime);

    await expect(service.updateSeatMatrix(1, [[0, 1]])).rejects.toThrow(
      '⚠️ Seat 2 on row 1 is already booked.'
    );
  });

  it('should book seats and update bookedCount correctly', async () => {
    const showtime = {
      id: 1,
      seatMatrix: [[0, 0], [0, 0]],
    } as Showtime;

    showtimeRepo.findOne.mockResolvedValue(showtime);
    showtimeRepo.update.mockResolvedValue({} as any);

    await service.updateSeatMatrix(1, [[0, 0], [1, 1]]);

    expect(showtimeRepo.update).toHaveBeenCalledWith(1, {
      seatMatrix: [[2, 0], [0, 2]],
      bookedCount: 2,
    });
  });

  it('should throw if showtime not found when updating seatMatrix', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);

    await expect(service.updateSeatMatrix(999, [[0, 0]])).rejects.toThrow(
      'Showtime 999 not found'
    );
  });

  it('should delete showtime', async () => {
    await service.delete(1);
    expect(showtimeRepo.delete).toHaveBeenCalledWith(1);
  });
});
