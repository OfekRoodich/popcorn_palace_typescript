import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  numberOfRows: number;

  @Column()
  numberOfColumns: number;

  // @OneToMany(() => Showtime, (showtime) => showtime.theater, { cascade: true })
  // showtimes: Showtime[];
}
