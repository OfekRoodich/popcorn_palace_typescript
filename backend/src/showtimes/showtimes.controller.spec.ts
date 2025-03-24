import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let showtimesService: ShowtimesService;
  let moviesService: MoviesService;

  const mockShowtimesService = {
    getShowtimeById: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockMoviesService = {
    findOne: jest.fn(),
  };

  const validShowtime = {
    movieId: 1,
    theater: 'Cinema 1',
    price: 15,
    startTime: new Date(Date.now() + 3600000), // One hour from this moment
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        { provide: ShowtimesService, useValue: mockShowtimesService },
        { provide: MoviesService, useValue: mockMoviesService },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should call getShowtimeById()', async () => {
    const showtime = { id: 1 };
    mockShowtimesService.getShowtimeById.mockResolvedValue(showtime);
    const result = await controller.getShowtimeById(1);
    expect(result).toEqual(showtime);
    expect(mockShowtimesService.getShowtimeById).toHaveBeenCalledWith(1);
  });

  

  it('should create a valid showtime', async () => {
    mockMoviesService.findOne.mockResolvedValue({ id: 1 });
    mockShowtimesService.create.mockResolvedValue({ id: 10 });

    const result = await controller.create(validShowtime);
    expect(result).toEqual({ id: 10 });
    expect(moviesService.findOne).toHaveBeenCalledWith(1);
    expect(showtimesService.create).toHaveBeenCalledWith(validShowtime);
  });

  it('should throw if movie not found on create', async () => {
    mockMoviesService.findOne.mockResolvedValue(null);
    await expect(controller.create(validShowtime)).rejects.toThrow(NotFoundException);
  });

  it('should update a valid showtime', async () => {
    mockMoviesService.findOne.mockResolvedValue({ id: 1 });
    mockShowtimesService.update.mockResolvedValue({
      id: 10,
      price: 15,
      movie: { id: 1 },
      theater: 'Cinema 1',
      startTime: validShowtime.startTime,
      endTime: new Date(Date.now() + 7200000).toISOString(),
    });

    const result = await controller.update(10, validShowtime);

    expect(result).toHaveProperty('id', 10);
    expect(showtimesService.update).toHaveBeenCalledWith(10, validShowtime);
  });

  it('should throw if movie not found on update', async () => {
    mockMoviesService.findOne.mockResolvedValue(null);
    await expect(controller.update(10, validShowtime)).rejects.toThrow(NotFoundException);
  });

  it('should call delete()', async () => {
    mockShowtimesService.delete.mockResolvedValue(undefined);
    await controller.delete(1);
    expect(showtimesService.delete).toHaveBeenCalledWith(1);
  });

  it('should throw if movieId is NaN', () => {
    const bad = { ...validShowtime, movieId: 'id' } as any;
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if theater is missing', () => {
    const bad = { ...validShowtime, theater: '' };
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if price is missing or 0', () => {
    const bad = { ...validShowtime, price: 0 };
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if startTime is missing', () => {
    const bad = { ...validShowtime };
    delete bad.startTime;
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if startTime is invalid', () => {
    const bad = { ...validShowtime, startTime: 'not-a-date' } as any;
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if startTime is before 1900', () => {
    const bad = { ...validShowtime, startTime: '1800-01-01T00:00:00Z' } as any;
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if startTime is in the past', () => {
    const bad = { ...validShowtime, startTime: new Date(Date.now() - 10000).toISOString() }as any;
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if price is negative', () => {
    const bad = { ...validShowtime, price: -10 };
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });

  it('should throw if movieId is 0 or negative', () => {
    const bad = { ...validShowtime, movieId: 0 };
    expect(() => controller['validateShowtime'](bad)).toThrow(BadRequestException);
  });
});
