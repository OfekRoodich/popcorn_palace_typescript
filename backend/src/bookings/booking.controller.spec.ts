import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BadRequestException } from '@nestjs/common';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockBookingsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking()', () => {
    const validBody = {
      showtimeId: 1,
      seatNumber: 5,
      userId: 'user-123',
    };

    it('should create a booking and return bookingId', async () => {
      const mockResponse = { bookingId: 'mock-id' };
      mockBookingsService.create.mockResolvedValue(mockResponse);

      const result = await controller.createBooking(validBody);
      expect(result).toEqual(mockResponse);
      expect(mockBookingsService.create).toHaveBeenCalledWith(validBody);
    });

    it('should throw if showtimeId is missing', async () => {
      await expect(
        controller.createBooking({ ...validBody, showtimeId: undefined as any })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if seatNumber is missing', async () => {
      await expect(
        controller.createBooking({ ...validBody, seatNumber: undefined as any })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if userId is missing', async () => {
      await expect(
        controller.createBooking({ ...validBody, userId: undefined as any })
      ).rejects.toThrow(BadRequestException);
    });
  });
});
