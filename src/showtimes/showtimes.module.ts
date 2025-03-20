import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './showtime.entity';
import { Movie } from '../movies/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
