import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { TheatersService } from '../theaters/theaters.service';
import { MoviesService } from '../movies/movies.service';
import { Showtime } from './showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(
    private readonly showtimesService: ShowtimesService,
    private readonly moviesService: MoviesService,
    private readonly theatersService: TheatersService,
  ) {}

  @Get()
  findAll(@Query('theaterId') theaterId?: string): Promise<Showtime[]> {
    if (theaterId) {
      return this.showtimesService.findAllForTheater(parseInt(theaterId, 10));
    }
    return this.showtimesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Showtime> {
    return this.showtimesService.findById(id);
  }

  @Post()
  async create(@Body() showtime: Partial<Showtime>): Promise<Showtime> {
    this.validateShowtime(showtime);

    const movie = await this.moviesService.findOne(showtime.movieId);
    if (!movie) throw new NotFoundException(`Movie with ID ${showtime.movieId} not found`);

    const theater = await this.theatersService.findOne(showtime.theaterId);
    if (!theater) throw new NotFoundException(`Theater with ID ${showtime.theaterId} not found`);

    return this.showtimesService.create(showtime);
  }

  @Post('update/:id')
  async update(@Param('id') id: number, @Body() showtime: Partial<Showtime>) {
    this.validateShowtime(showtime);

    const movie = await this.moviesService.findOne(showtime.movieId);
    if (!movie) throw new NotFoundException(`Movie with ID ${showtime.movieId} not found`);

    const theater = await this.theatersService.findOne(showtime.theaterId);
    if (!theater) throw new NotFoundException(`Theater with ID ${showtime.theaterId} not found`);

    const updated = await this.showtimesService.update(id, showtime);

    return {
      message: `Showtime ${id} updated successfully`,
      updated,
    };
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.showtimesService.delete(id);
  }

  @Post(':id/seats')
  updateSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { selectedSeats: [number, number][] },
  ) {
    // return this.showtimesService.updateSeatMatrix(id, body.selectedSeats);
  }

  private validateShowtime(showtime: Partial<Showtime>) {
    if (isNaN(Number(showtime.movieId)))
      throw new BadRequestException('⚠️ Movie must be selected');
    if (isNaN(Number(showtime.theaterId)))
      throw new BadRequestException('⚠️ Theater must be selected');
    if (!showtime.price)
      throw new BadRequestException("⚠️ Showtime price can't be empty or 0");
    if (!showtime.startTime)
      throw new BadRequestException('⚠️ Start time must be selected');

    if (isNaN(Number(showtime.price)))
      throw new BadRequestException('⚠️ Showtime price must be a number');

    const startTime = new Date(showtime.startTime);
    if (isNaN(startTime.getTime()))
      throw new BadRequestException('startTime is not a valid date');

    const currentDate = new Date();
    const year1900 = new Date('1900-01-01');
    if (startTime < year1900)
      throw new BadRequestException('⚠️ startTime cannot be before the year 1900');
    if (startTime < currentDate)
      throw new BadRequestException('⚠️ startTime must be in the future');

    if (Number(showtime.price) <= 0)
      throw new BadRequestException('⚠️ Showtime price must be greater than 0');

    if (showtime.movieId <= 0)
      throw new BadRequestException('⚠️ Movie ID must be a positive integer');
    if (showtime.theaterId <= 0)
      throw new BadRequestException('⚠️ Theater ID must be a positive integer');
  }
}
