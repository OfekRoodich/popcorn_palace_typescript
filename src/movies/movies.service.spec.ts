import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  create(movie: Partial<Movie>): Promise<Movie> {
    return this.movieRepository.save(movie);
  }

  update(id: number, movie: Partial<Movie>): Promise<any> {
    return this.movieRepository.update(id, movie);
  }

  delete(id: number): Promise<any> {
    return this.movieRepository.delete(id);
  }
}
