import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './booking.entity';
import { Showtime } from '../showtimes/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Showtime])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
