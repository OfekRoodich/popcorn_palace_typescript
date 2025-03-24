import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column()
  seatNumber: number;

  @Column()
  userId: string;

  @Column()
  showtimeId: number;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;
}
