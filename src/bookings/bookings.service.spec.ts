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
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
    const showtime = {
      id: 1,
      seatMatrix: [[0, 0], [0, 0]],
      bookedCount: 0,
    } as Showtime;

    showtimeRepo.findOne.mockResolvedValue(showtime);

    const mockBooking: Booking = {
      bookingId: '1',
      seatNumber: 1,
      showtimeId: 1,
      userId: 'user123',
      showtime: showtime,
    };

    bookingRepo.create.mockReturnValue(mockBooking);
    bookingRepo.save.mockResolvedValue(mockBooking);
    showtimeRepo.save.mockResolvedValue(showtime);

    const result = await service.create({ showtimeId: 1, seatNumber: 1, userId: 'user123' });

    expect(showtimeRepo.save).toHaveBeenCalled();
    expect(bookingRepo.save).toHaveBeenCalled();
    expect(result).toEqual({ bookingId: '1' });
  });

  it('should throw if showtime not found', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);

    await expect(service.create({ showtimeId: 999, seatNumber: 0, userId: 'user' })).rejects.toThrow(
      'Showtime 999 not found'
    );
  });

  it('should throw for invalid seat number', async () => {
    const showtime = {
      id: 1,
      seatMatrix: [[0, 0], [0, 0]],
    } as Showtime;

    showtimeRepo.findOne.mockResolvedValue(showtime);

    await expect(service.create({ showtimeId: 1, seatNumber: 10, userId: 'user' })).rejects.toThrow(
      'Invalid seat number: 10'
    );
  });

  it('should throw if seat is already booked', async () => {
    const showtime = {
      id: 1,
      seatMatrix: [[2, 0], [0, 0]],
    } as Showtime;

    showtimeRepo.findOne.mockResolvedValue(showtime);

    await expect(service.create({ showtimeId: 1, seatNumber: 0, userId: 'user' })).rejects.toThrow(
      '⚠️ Seat 1 on row 1 is already booked.'
    );
  });
});