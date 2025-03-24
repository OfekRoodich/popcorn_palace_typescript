import { Showtime } from '../showtimes/showtime.entity';
export declare class Booking {
    bookingId: string;
    seatNumber: number;
    userId: string;
    showtimeId: number;
    showtime: Showtime;
}
