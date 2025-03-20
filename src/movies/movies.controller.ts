import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  create(@Body() movie: Partial<Movie>): Promise<Movie> {
    return this.moviesService.create(movie);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() movie: Partial<Movie>) {
    return this.moviesService.update(id, movie);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.moviesService.delete(id);
  }
}
