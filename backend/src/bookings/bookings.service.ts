import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Showtime } from '../showtimes/showtime.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async create(data: { showtimeId: number; seatNumber: number; userId: string }) {
    const { showtimeId, seatNumber, userId } = data;

    // ✅ Validate seatNumber is between 1 and 99
    if (seatNumber < 1 || seatNumber > 99) {
      throw new BadRequestException('Seat number must be between 1 and 99');
    }

    // 🧠 Fetch the showtime
    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    if (!showtime) throw new BadRequestException(`Showtime ${showtimeId} not found`);

    // ✅ Check if seat already booked in booking table
    const existingBooking = await this.bookingRepository.findOne({
      where: { seatNumber, showtimeId },
    });

    if (existingBooking) {
      throw new BadRequestException(`Seat ${seatNumber} is already booked for showtime ${showtimeId}`);
    }

    // ✅ Save booking
    const booking = this.bookingRepository.create({ showtimeId, seatNumber, userId });
    const saved = await this.bookingRepository.save(booking);

    return { bookingId: saved.bookingId };
  }
}
