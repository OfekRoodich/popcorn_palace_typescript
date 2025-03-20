import { Module } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { Theater } from './theater.entity';

@Module({
  providers: [TheatersService],
  controllers: [TheatersController]
})
export class TheatersModule {}
