import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { Theater } from './theater.entity'; // ✅ Import the Theater entity

@Module({
  imports: [TypeOrmModule.forFeature([Theater])], // ✅ Ensure this is added
  controllers: [TheatersController],
  providers: [TheatersService],
  exports: [TheatersService], //
})
export class TheatersModule {}
