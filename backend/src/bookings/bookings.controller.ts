import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Body() body: { showtimeId: number; seatNumber: number; userId: string }
  ) {
    const { showtimeId, seatNumber, userId } = body;

    if (!showtimeId || isNaN(showtimeId)) {
      throw new BadRequestException('⚠️ Invalid or missing showtimeId');
    }

    if (!seatNumber && seatNumber !== 0) {
      throw new BadRequestException('⚠️ seatNumber is required');
    }

    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('⚠️ userId is required');
    }

    return this.bookingsService.create({ showtimeId, seatNumber, userId });
  }
}
