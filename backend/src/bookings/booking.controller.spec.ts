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
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
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

  it('should call bookingsService.create with valid input', async () => {
    const dto = { showtimeId: 1, seatNumber: 10, userId: 'user123' };
    const mockResponse = { bookingId: 42 };

    mockBookingsService.create.mockResolvedValue(mockResponse);

    const result = await controller.createBooking(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockResponse);
  });

  it('should throw BadRequestException for missing showtimeId', async () => {
    const dto = { seatNumber: 10, userId: 'user123' } as any;

    await expect(controller.createBooking(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid seatNumber', async () => {
    const dto = { showtimeId: 1, seatNumber: 0, userId: 'user123' };

    await expect(controller.createBooking(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid userId', async () => {
    const dto = { showtimeId: 1, seatNumber: 10, userId: ' ' };

    await expect(controller.createBooking(dto)).rejects.toThrow(BadRequestException);
  });
});
