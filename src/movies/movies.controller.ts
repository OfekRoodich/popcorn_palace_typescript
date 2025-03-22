import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
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
  async create(@Body() movie: Partial<Movie>): Promise<Movie> { // Returning explicitly the missing fields if missing
    if (!movie.title || !movie.title.trim)
      throw new BadRequestException("⚠️ Movie title can't be empty");
    if (!movie.genre)
      throw new BadRequestException("⚠️ Movie genre can't be empty");
    if (!movie.duration)
      throw new BadRequestException("⚠️ Movie duration can't be empty");
    if (!movie.rating)
      throw new BadRequestException("⚠️ Movie rating can't be empty");
    if (!movie.releaseYear)
      throw new BadRequestException("⚠️ Movie release year can't be empty");

    if (typeof movie.duration !== "number")
      throw new BadRequestException("⚠️ Movie duration must be a number");
    if (typeof movie.rating !== "number")
      throw new BadRequestException("⚠️ Movie rating must be a number");
    if (typeof movie.releaseYear !== "number")
      throw new BadRequestException("⚠️ Movie release year must be a number");
    
    if (movie.duration <= 0 )
      throw new BadRequestException("⚠️ Movie duration must be a positive number");
    if (movie.rating> 10.0 || movie.rating<0)
      throw new BadRequestException("⚠️Movie rating must be between 0 to 10");

    if (movie.releaseYear< 1900)
      throw new BadRequestException("⚠️Movie release year is too old");

    if (movie.releaseYear> new Date().getFullYear())
      throw new BadRequestException("⚠️ release year can't be in the future");
    
    return this.moviesService.create(movie);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() movie: Partial<Movie>,
  ) {
    if (!movie.title || !movie.title.trim)
      throw new BadRequestException("⚠️ Movie title can't be empty");
    if (!movie.genre || !movie.genre.trim())
      throw new BadRequestException("⚠️ Movie genre can't be empty");
    if (movie.duration === undefined || movie.duration === null)
      throw new BadRequestException("⚠️ Movie duration can't be empty");
    if (movie.rating === undefined || movie.rating === null)
      throw new BadRequestException("⚠️ Movie rating can't be empty");
    if (movie.releaseYear === undefined || movie.releaseYear === null)
      throw new BadRequestException("⚠️ Movie release year can't be empty");
  
    if (typeof movie.duration !== "number")
      throw new BadRequestException("⚠️ Movie duration must be a number");
    if (typeof movie.rating !== "number")
      throw new BadRequestException("⚠️ Movie rating must be a number");
    if (typeof movie.releaseYear !== "number")
      throw new BadRequestException("⚠️ Movie release year must be a number");
  
    if (movie.duration <= 0 )
      throw new BadRequestException("⚠️ Movie duration must be a positive number");
  
    if (movie.rating > 10.0 || movie.rating < 0)
      throw new BadRequestException("⚠️ Movie rating must be between 0 to 10");
  
    if (movie.releaseYear < 1900)
      throw new BadRequestException("⚠️ Movie release year is too old");
  
    if (movie.releaseYear > new Date().getFullYear())
      throw new BadRequestException("⚠️ Release year can't be in the future");
  
    const result = await this.moviesService.update(id, movie);
  
    if (!result.affected) {
      throw new NotFoundException(`Movie with ID ${id} was not found`);
    }
  
    return { message: `Movie ${id} updated successfully` };
  }
  

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) { // if  id can't be parsed to number, there will be an error (ParseIntPipe)
    const result = await this.moviesService.delete(id);
    if (!result.affected) { // result.affected would be 0 if nothing was deleted (id wasn't found)
      throw new NotFoundException(`Movie with ID ${id} was not found`);
    }

    return { message: `Movie ${id} deleted successfully` };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> { // if  id can't be parsed to number, there will be an error (ParseIntPipe)
    const movie = await this.moviesService.findOne(id);

    if (!movie) { // movie would be null if nothing was deleted (id wasn't found)
      throw new NotFoundException(`Movie with ID ${id} was not found`);
    }

    return movie;
  }
}
