import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  findAll(@Query('theaterId') theaterId?: string): Promise<Showtime[]> {
    if (theaterId) {
      console.log("📌 Filtering by theaterId:", theaterId);
      return this.showtimesService.findAllForTheater(parseInt(theaterId, 10));
    }
  
    console.log("📦 Returning all showtimes (no filter)");
    return this.showtimesService.findAll();
  }
  

  @Get(':id')
  findById(@Param('id') id: number): Promise<Showtime> {
    return this.showtimesService.findById(id);
  }

  @Post()
  create(@Body() showtime: Partial<Showtime>): Promise<Showtime> {
    return this.showtimesService.create(showtime);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() showtime: Partial<Showtime>) {
    return this.showtimesService.update(id, showtime);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.showtimesService.delete(id);
  }

  
  


}
