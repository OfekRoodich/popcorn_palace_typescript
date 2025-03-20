import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async findAll(): Promise<Showtime[]> {
    return this.showtimeRepository.find({ relations: ['movie'] });
  }

  async findById(id: number): Promise<Showtime> {
    return this.showtimeRepository.findOne({ where: { id }, relations: ['movie'] });
  }

  async create(showtime: Partial<Showtime>): Promise<Showtime> {
    return this.showtimeRepository.save(showtime);
  }

  async update(id: number, showtime: Partial<Showtime>): Promise<any> {
    return this.showtimeRepository.update(id, showtime);
  }

  async delete(id: number): Promise<any> {
    return this.showtimeRepository.delete(id);
  }
}
