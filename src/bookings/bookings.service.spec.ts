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

  describe('createBooking', () => {
    const validBody = {
      showtimeId: 1,
      seatNumber: 15,
      userId: 'abc-123',
    };

    it('should call service and return bookingId', async () => {
      mockBookingsService.create.mockResolvedValue({ bookingId: 'xyz-456' });

      const result = await controller.createBooking(validBody);
      expect(result).toEqual({ bookingId: 'xyz-456' });
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
