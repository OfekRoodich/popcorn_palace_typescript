import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,ManyToMany,JoinTable } from 'typeorm';

import { Movie } from '../movies/movie.entity';
import { Theater } from '../theaters/theater.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: false })  // ✅ Explicitly define `movieId` as a column
  movieId: number;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })  // ✅ Ensure `movieId` is properly mapped
  movie: Movie;

  @Column('timestamp')
  startTime: Date;

  @ManyToOne(() => Theater, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theaterId' })  // ✅ Ensure `theaterId` is properly mapped
  theater: Theater;
}
