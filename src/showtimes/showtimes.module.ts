import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './showtime.entity';
import { Theater } from '../theaters/theater.entity';
import { Movie } from '../movies/movie.entity';
import { MoviesModule } from '../movies/movies.module';
import { TheatersModule } from '../theaters/theaters.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime, Theater, Movie]), // 
    MoviesModule,
    TheatersModule,
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
