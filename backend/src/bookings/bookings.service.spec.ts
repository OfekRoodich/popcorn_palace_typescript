import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Showtime } from '../showtimes/showtime.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepo: jest.Mocked<Repository<Booking>>;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;

  const mockRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useFactory: mockRepository },
        { provide: getRepositoryToken(Showtime), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get(BookingsService);
    bookingRepo = module.get(getRepositoryToken(Booking));
    showtimeRepo = module.get(getRepositoryToken(Showtime));
  });

  it('should book a seat successfully', async () => {
    const bookingData = { showtimeId: 5000, seatNumber: 1, userId: 'user123' };
  
    bookingRepo.findOne.mockResolvedValue(null);
    showtimeRepo.findOne.mockResolvedValue({ id: 1 } as Showtime); 
    bookingRepo.create.mockReturnValue({ bookingId: 'uuid-123', ...bookingData } as Booking);
    bookingRepo.save.mockResolvedValue({ bookingId: 'uuid-123', ...bookingData } as Booking);
  
    const result = await service.create(bookingData);
  
    expect(bookingRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      showtimeId: 5000,
      seatNumber: 1,
      userId: 'user123',
    }));
    expect(result).toEqual({ bookingId: 'uuid-123' });
  });
  

  it('should throw if showtime not found', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({ showtimeId: 999, seatNumber: 1, userId: 'user' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if seat is already booked', async () => {
    const mockShowtime = { id: 1 } as Showtime;
  
    bookingRepo.findOne.mockResolvedValue({
      bookingId: 'uuid-existing',
      seatNumber: 1,
      showtimeId: 1,
      userId: 'user-existing',
      showtime: mockShowtime, 
    });
  
    showtimeRepo.findOne.mockResolvedValue(mockShowtime);
  
    await expect(
      service.create({ showtimeId: 1, seatNumber: 1, userId: 'user123' })
    ).rejects.toThrow(BadRequestException);
  });
  

  it('should throw for invalid seat number (out of range)', async () => {
    showtimeRepo.findOne.mockResolvedValue({ id: 1 } as Showtime);

    await expect(
      service.create({ showtimeId: 1, seatNumber: 150, userId: 'user' })
    ).rejects.toThrow(BadRequestException);
  });
});
