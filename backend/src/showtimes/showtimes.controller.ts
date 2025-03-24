import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { Showtime } from './showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(
    private readonly showtimesService: ShowtimesService,
    private readonly moviesService: MoviesService,
  ) {}


  @Get(':id')
  getShowtimeById(@Param('id') id: number): Promise<Showtime> {
    return this.showtimesService.getShowtimeById(id);
  }

  @Post()
  async create(@Body() showtime: Partial<Showtime>): Promise<Partial<Showtime>> {
    this.validateShowtime(showtime);
  
    const movie = await this.moviesService.findOne(showtime.movieId);
    if (!movie) throw new NotFoundException(`Movie with ID ${showtime.movieId} not found`);
  
    return this.showtimesService.create(showtime);
  }
  

  @Post('update/:id')
  async update(@Param('id') id: number, @Body() showtime: Partial<Showtime>) {
    this.validateShowtime(showtime);

    const movie = await this.moviesService.findOne(showtime.movieId);
    if (!movie) throw new NotFoundException(`Movie with ID ${showtime.movieId} not found`);

    const updated = await this.showtimesService.update(id, showtime);
    return { "id": updated.id, "price": updated.price ,"movieId": updated.movie.id, "theater": updated.theater, "startTime": updated.startTime, "endTime": updated.endTime }                                                          
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.showtimesService.delete(id);
  }

  private validateShowtime(showtime: Partial<Showtime>) {
    if (showtime.movieId === undefined || showtime.movieId === null)
      throw new BadRequestException('Movie Id is missing or empty');
    if (!showtime.theater || !showtime.theater.trim())
      throw new BadRequestException('Theater name is missing or empty');
    if (showtime.price === undefined || showtime.price === null)
      throw new BadRequestException("Price is missing or empty");
    if (!showtime.startTime)
      throw new BadRequestException('Start time must be selected');
    const startTime = new Date(showtime.startTime);
    if (isNaN(startTime.getTime()))
      throw new BadRequestException('Start Timeis missing or empty');

    if (typeof showtime.movieId !== 'number')
      throw new BadRequestException("Movie Id must be a number");
    if (typeof showtime.price !== 'number')
      throw new BadRequestException("Showtime Price must be a number");
    if (typeof showtime.theater !== 'string')
      throw new BadRequestException("Theater must be a string");


    const currentDate = new Date();
    const year1900 = new Date('1900-01-01');
    if (startTime < year1900)
      throw new BadRequestException('startTime cannot be before the year 1900');
    if (startTime < currentDate)
      throw new BadRequestException('startTime must be in the future');

    if (showtime.price <= 0)
      throw new BadRequestException('Showtime price must be greater than 0');

    if (showtime.movieId <= 0)
      throw new BadRequestException('Movie ID must be a positive integer');
  }
}
