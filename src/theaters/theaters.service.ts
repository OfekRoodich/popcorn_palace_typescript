import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from './theater.entity';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private theaterRepository: Repository<Theater>,
  ) {}

  async findAll(): Promise<Theater[]> {
    return this.theaterRepository.find();
  }

  async create(theater: Partial<Theater>): Promise<Theater> {
    return this.theaterRepository.save(theater);
  }

    async update(id: number, theater: Partial<Theater>): Promise<any> {
      return this.theaterRepository.update(id, theater);
    }
  
    async delete(id: number): Promise<any> {
      return this.theaterRepository.delete(id);
    }

    async findOne(id: number): Promise<Theater | null> {
      return this.theaterRepository.findOne({ where: { id } });
    }
    
}
