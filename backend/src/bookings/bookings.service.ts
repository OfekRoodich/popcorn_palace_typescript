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

    // 🧠 Fetch the showtime
    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    if (!showtime) throw new BadRequestException(`Showtime ${showtimeId} not found`);

    const rows = showtime.seatMatrix.length;
    const cols = showtime.seatMatrix[0].length;

    const row = Math.floor(seatNumber / cols);
    const col = seatNumber % cols;

    if (row >= rows || col >= cols) {
      throw new BadRequestException(`Invalid seat number: ${seatNumber}`);
    }

    if (showtime.seatMatrix[row][col] === 2) {
      throw new BadRequestException(`⚠️ Seat ${col + 1} on row ${row + 1} is already booked.`);
    }

    // ✅ Mark seat as booked
    showtime.seatMatrix[row][col] = 2;
    showtime.bookedCount = showtime.seatMatrix.flat().filter(seat => seat === 2).length;

    await this.showtimeRepository.save(showtime);

    // ✅ Create and save the booking
    const booking = this.bookingRepository.create({ showtimeId, seatNumber, userId });
    const saved = await this.bookingRepository.save(booking);

    return { bookingId: saved.bookingId };
  }
}
