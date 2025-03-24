import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  async create(@Body() movie: Partial<Movie>): Promise<Movie> {
    if (!movie.title || !movie.title.trim())
      throw new BadRequestException("Movie title can't be empty");
    if (!movie.genre || !movie.genre.trim())
      throw new BadRequestException("Movie genre can't be empty");
    if (movie.duration === undefined || movie.duration === null)
      throw new BadRequestException("Movie duration can't be empty");
    if (movie.rating === undefined || movie.rating === null)
      throw new BadRequestException("Movie rating can't be empty");
    if (movie.releaseYear === undefined || movie.releaseYear === null)
      throw new BadRequestException("Movie release year can't be empty");

    if (typeof movie.duration !== 'number')
      throw new BadRequestException("Movie duration must be a number");
    if (typeof movie.rating !== 'number')
      throw new BadRequestException("Movie rating must be a number");
    if (typeof movie.releaseYear !== 'number')
      throw new BadRequestException("Movie release year must be a number");

    if (movie.duration <= 0)
      throw new BadRequestException("Movie duration must be a positive number");
    if (movie.rating > 10.0 || movie.rating < 0)
      throw new BadRequestException("Movie rating must be between 0 to 10");
    if (movie.releaseYear < 1900)
      throw new BadRequestException("Movie release year is too old");
    if (movie.releaseYear > new Date().getFullYear())
      throw new BadRequestException("Release year can't be in the future");

    return this.moviesService.create(movie);
  }

  @Post('update/:title')
  async updateByTitle(
    @Param('title') title: string,
    @Body() movie: Partial<Movie>,
  ) {
    if (!movie.title || !movie.title.trim())
      throw new BadRequestException("Movie title is empty or missing");
    if (!movie.genre || !movie.genre.trim())
      throw new BadRequestException("Movie is empty or missing");
    if (movie.duration === undefined || movie.duration === null)
      throw new BadRequestException("Movie is empty or missing");
    if (movie.rating === undefined || movie.rating === null)
      throw new BadRequestException("Movie is empty or missing");
    if (movie.releaseYear === undefined || movie.releaseYear === null)
      throw new BadRequestException("Movie is empty or missing");

    if (typeof movie.duration !== 'number')
      throw new BadRequestException("Movie duration must be a number");
    if (typeof movie.rating !== 'number')
      throw new BadRequestException("Movie rating must be a number");
    if (typeof movie.releaseYear !== 'number')
      throw new BadRequestException("Movie release year must be a number");

    if (movie.duration <= 0)
      throw new BadRequestException("Movie duration must be a positive number");
    if (movie.rating > 10.0 || movie.rating < 0)
      throw new BadRequestException("Movie rating must be between 0 to 10");
    if (movie.releaseYear < 1900)
      throw new BadRequestException("Movie release year is too old");
    if (movie.releaseYear > new Date().getFullYear())
      throw new BadRequestException("Release year can't be in the future");

    const existing = await this.moviesService.findByTitle(title);
    if (!existing) throw new NotFoundException(`Movie "${title}" not found`);

    await this.moviesService.update(existing.id, movie);
    return movie;
  }

  @Delete(':title')
  async deleteByTitle(@Param('title') title: string) {
    const existing = await this.moviesService.findByTitle(title);
    if (!existing) throw new NotFoundException(`Movie "${title}" not found`);

    await this.moviesService.delete(existing.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    const movie = await this.moviesService.findOne(id);
    if (!movie) throw new NotFoundException(`Movie with ID ${id} was not found`);
    return movie;
  }
}