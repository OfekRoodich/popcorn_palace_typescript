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

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['showtime'] });
  }

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    // Check if the seat is already booked
    const existingBooking = await this.bookingRepository.findOne({
        where: { showtime: { id: Number(bookingData.showtime) }, seatNumber: bookingData.seatNumber },
      });
      

    if (existingBooking) {
      throw new BadRequestException('Seat is already booked for this showtime.');
    }

    return this.bookingRepository.save(bookingData);
  }

  async delete(id: string): Promise<any> {
    return this.bookingRepository.delete(id);
  }
}
