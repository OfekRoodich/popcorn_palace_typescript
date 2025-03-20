import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';
import { TheatersModule } from './theaters/theaters.module';
import { Theater } from './theaters/theater.entity';
import { Showtime } from './showtimes/showtime.entity';
import { Movie } from './movies/movie.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      autoLoadEntities: true,
      entities: [Theater, Showtime, Movie, Booking],
      synchronize: true,
    }),
    MoviesModule,
    ShowtimesModule,
    BookingsModule,
    TheatersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
