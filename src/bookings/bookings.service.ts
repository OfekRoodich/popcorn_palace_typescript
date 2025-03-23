import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(data: { showtimeId: number; seatNumber: number; userId: string }) {
    const booking = this.bookingRepository.create(data);
    const saved = await this.bookingRepository.save(booking);
    return { bookingId: saved.bookingId };
  }
}
