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

    if (!showtimeId || typeof showtimeId !== 'number' || isNaN(showtimeId)) {
      throw new BadRequestException('Invalid or missing showtimeId');
    }

    if (typeof seatNumber !== 'number' || seatNumber < 1 || seatNumber > 99) {
      throw new BadRequestException('seatNumber must be a number between 1 and 99');
    }

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new BadRequestException('userId must be a non-empty string');
    }

    return this.bookingsService.create({ showtimeId, seatNumber, userId });
  }
}
