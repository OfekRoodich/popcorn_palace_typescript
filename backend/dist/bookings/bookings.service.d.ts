import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Showtime } from '../showtimes/showtime.entity';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly showtimeRepository;
    constructor(bookingRepository: Repository<Booking>, showtimeRepository: Repository<Showtime>);
    create(data: {
        showtimeId: number;
        seatNumber: number;
        userId: string;
    }): Promise<{
        bookingId: string;
    }>;
}
