import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(body: {
        showtimeId: number;
        seatNumber: number;
        userId: string;
    }): Promise<{
        bookingId: string;
    }>;
}
