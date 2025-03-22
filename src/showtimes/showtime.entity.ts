import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,ManyToMany,JoinTable } from 'typeorm';

import { Movie } from '../movies/movie.entity';
import { Theater } from '../theaters/theater.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @Column()
  movieId: number; 

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
  
  @Column()
  theaterId: number;

  @ManyToOne(() => Theater, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theaterId' })
  theater: Theater;

  @Column('timestamp')
  startTime: Date;

  @Column("int", { array: true, nullable: false })
  seatMatrix: number[][];

  @Column({ default: 0 })
  bookedCount: number;
}
