import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { TheatersService } from '../theaters/theaters.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Showtime } from './showtime.entity';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let showtimesService: jest.Mocked<ShowtimesService>;
  let moviesService: jest.Mocked<MoviesService>;
  let theatersService: jest.Mocked<TheatersService>;

  const mockShowtime: Showtime = {
    id: 1,
    movieId: 1,
    theaterId: 1,
    startTime: new Date(Date.now() + 60 * 60000),
    endTime: new Date(Date.now() + 120 * 60000),
    seatMatrix: [[0]],
    price: 20,
    bookedCount: 0,
    movie: null,
    theater: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: {
            findAll: jest.fn(),
            findAllForTheater: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            updateSeatMatrix: jest.fn(),
          },
        },
        {
          provide: MoviesService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: TheatersService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    showtimesService = module.get(ShowtimesService);
    moviesService = module.get(MoviesService);
    theatersService = module.get(TheatersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all showtimes', async () => {
    showtimesService.findAll.mockResolvedValue([mockShowtime]);
    const result = await controller.findAll();
    expect(result).toEqual([mockShowtime]);
  });

  it('should return showtimes for a specific theater', async () => {
    showtimesService.findAllForTheater.mockResolvedValue([mockShowtime]);
    const result = await controller.findAll('1');
    expect(showtimesService.findAllForTheater).toHaveBeenCalledWith(1);
    expect(result).toEqual([mockShowtime]);
  });

  it('should return a showtime by ID', async () => {
    showtimesService.findById.mockResolvedValue(mockShowtime);
    const result = await controller.findById(1);
    expect(result).toEqual(mockShowtime);
  });

 it('should create a valid showtime', async () => {
  const body = { ...mockShowtime };

  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2023,
  };

  const mockTheater = {
    id: 1,
    name: 'Main Theater',
    numberOfRows: 5,
    numberOfColumns: 5,
  };

  moviesService.findOne.mockResolvedValue(mockMovie);
  theatersService.findOne.mockResolvedValue(mockTheater);
  showtimesService.create.mockResolvedValue(mockShowtime);

  const result = await controller.create(body);
  expect(result).toEqual(mockShowtime);
});


  it('should throw if movie not found on create', async () => {
    moviesService.findOne.mockResolvedValue(null);
    await expect(controller.create({ ...mockShowtime })).rejects.toThrow(NotFoundException);
  });

  it('should throw if theater not found on create', async () => {
    const mockMovie = {
      id: 1,
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
    };

    moviesService.findOne.mockResolvedValue(mockMovie);
    theatersService.findOne.mockResolvedValue(null);
    await expect(controller.create({ ...mockShowtime })).rejects.toThrow(NotFoundException);
  });

  it('should update a showtime', async () => {
    const updatedShowtime = { ...mockShowtime, price: 25 };
    const mockMovie = {
      id: 1,
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
    };
  
    const mockTheater = {
      id: 1,
      name: 'Main Theater',
      numberOfRows: 5,
      numberOfColumns: 5,
    };
    moviesService.findOne.mockResolvedValue(mockMovie);
    theatersService.findOne.mockResolvedValue(mockTheater);
    showtimesService.update.mockResolvedValue(updatedShowtime);

    const result = await controller.update(1, updatedShowtime);
    expect(result.updated).toEqual(updatedShowtime);
  });

  it('should delete a showtime', async () => {
    await controller.delete(1);
    expect(showtimesService.delete).toHaveBeenCalledWith(1);
  });

  it('should throw on invalid startTime (too old)', async () => {
    const showtime = { ...mockShowtime, startTime: new Date('1800-01-01') };
    expect(() => controller['validateShowtime'](showtime)).toThrow(BadRequestException);
  });

  it('should throw on missing price', async () => {
    const showtime = { ...mockShowtime, price: 0 };
    expect(() => controller['validateShowtime'](showtime)).toThrow(BadRequestException);
  });

  it('should throw on invalid movieId or theaterId', () => {
    const showtime = { ...mockShowtime, movieId: -1, theaterId: 0 };
    expect(() => controller['validateShowtime'](showtime)).toThrow(BadRequestException);
  });

  
});
