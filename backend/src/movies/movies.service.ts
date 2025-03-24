import { Injectable, BadRequestException } from '@nestjs/common';
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
  
  findOne(id: number): Promise<Movie | null> {
    return this.movieRepository.findOne({ where: { id } });
  }
  
  findByTitle(title: string): Promise<Movie | null> {
    return this.movieRepository.findOne({ where: { title } });
  }
  
  async create(movie: Partial<Movie>): Promise<Movie> {
    this.validateMovie(movie);
  
    const existing = await this.findByTitle(movie.title);
    if (existing) {
      throw new BadRequestException(`A movie with the title "${movie.title}" already exists.`);
    }
  
    return this.movieRepository.save(movie);
  }
  
  
  async update(id: number, movie: Partial<Movie>): Promise<any> {
    this.validateMovie(movie);
  
    if (movie.title) {
      const existing = await this.findByTitle(movie.title);
      if (existing && existing.id !== id) {
        throw new BadRequestException(`A movie with the title "${movie.title}" already exists.`);
      }
    }
  
    return this.movieRepository.update(id, movie);
  }
  
  
  delete(id: number): Promise<any> {
    return this.movieRepository.delete(id);
  }

  private validateMovie(movie: Partial<Movie>) {
    const { title, duration, rating, releaseYear } = movie;

    if (typeof duration !== 'number' ||!title || title.trim() === '')
      throw new BadRequestException('Title cannot be empty.');

    if (typeof duration !== 'number' || duration <= 0)
      throw new BadRequestException('Duration must be a positive number.');

    if (typeof rating !== 'number' || rating < 0 || rating > 10)
      throw new BadRequestException('Rating must be between 0 and 10.');

    const currentYear = new Date().getFullYear();
    if (typeof releaseYear !== 'number' || releaseYear > currentYear)
      throw new BadRequestException(`Release year can't be greater than ${currentYear}.`);
  }
}
