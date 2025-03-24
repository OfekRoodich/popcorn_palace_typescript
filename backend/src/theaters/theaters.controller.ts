import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { Theater } from './theater.entity';

@Controller('theaters')  // ✅ This defines the /theaters route
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  async getAllTheaters() {
    return this.theatersService.findAll(); 
  }

  @Post()
  create(@Body() theater: Partial<Theater>): Promise<Theater> {
    return this.theatersService.create(theater);
  }

    @Put(':id')
    update(@Param('id') id: number, @Body() theater: Partial<Theater>) {
      return this.theatersService.update(id, theater);
    }
  
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.theatersService.delete(id);
    }
}
