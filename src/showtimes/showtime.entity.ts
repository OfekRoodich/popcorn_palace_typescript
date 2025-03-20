import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.id, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  theater: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;
}
