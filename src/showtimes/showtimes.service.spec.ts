import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { TheatersService } from '../theaters/theaters.service';
import { BadRequestException } from '@nestjs/common';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;

  const mockShowtimesService = {
    findAll: jest.fn(),
    findAllForTheater: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateSeatMatrix: jest.fn(),
  };

  const mockMoviesService = {
    findOne: jest.fn(),
  };

  const mockTheatersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        { provide: ShowtimesService, useValue: mockShowtimesService },
        { provide: MoviesService, useValue: mockMoviesService },
        { provide: TheatersService, useValue: mockTheatersService },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw when trying to update a showtime with booked tickets', async () => {
    const updateDto = {
      movieId: 1,
      theaterId: 2,
      price: 50,
      startTime: new Date(),
    };

    mockMoviesService.findOne.mockResolvedValue({ id: 1 });
    mockTheatersService.findOne.mockResolvedValue({ id: 2 });
    mockShowtimesService.update.mockImplementation(() => {
      throw new BadRequestException('⚠️ Cannot update a showtime with booked tickets');
    });

    await expect(controller.update(1, updateDto)).rejects.toThrow('⚠️ Cannot update a showtime with booked tickets');
  });
});
