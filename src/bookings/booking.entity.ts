import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.id, { onDelete: 'CASCADE' })
  showtime: Showtime;

  @Column()
  seatNumber: number;

  @Column()
  userId: string;
}