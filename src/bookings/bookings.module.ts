import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { Showtime } from '../showtimes/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking,Showtime])],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
