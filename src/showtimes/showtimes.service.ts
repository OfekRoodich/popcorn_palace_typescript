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
    return this.showtimeRepository.find({
      relations: ['movie', 'theater'], 
    });
  }
  

  async findById(id: number): Promise<Showtime> {
    return this.showtimeRepository.findOne({ where: { id }, relations: ['movie', 'theater'] });
  }

  async create(data: Partial<Showtime>): Promise<Showtime> {
    const showtime = this.showtimeRepository.create({
      movie: { id: data.movieId },
      theater: { id: (data as any).theaterId },
      startTime: data.startTime,
      price: data.price,
    });
  
    const savedShowtime = await this.showtimeRepository.save(showtime);
  
    return this.showtimeRepository.findOne({
      where: { id: savedShowtime.id },
      relations: ['movie', 'theater'],
    });
  }
  
  async findAllForTheater(theaterId: number): Promise<Showtime[]> {
  
    return this.showtimeRepository
      .createQueryBuilder("showtime")
      .leftJoinAndSelect("showtime.movie", "movie")
      .leftJoinAndSelect("showtime.theater", "theater")
      .where("theater.id = :theaterId", { theaterId })
      .getMany();
  }
  
  
  async update(id: number, data: Partial<Showtime>): Promise<any> {
    const updateData: any = {
      startTime: data.startTime,
      price: data.price,
    };
  
    if (data.movieId) {
      updateData.movie = { id: data.movieId };
    }
  
    if ((data as any).theaterId) {
      updateData.theater = { id: (data as any).theaterId };
    }
  
    return this.showtimeRepository.update(id, updateData);
  }
  

  async delete(id: number): Promise<any> {
    return this.showtimeRepository.delete(id);
  }

}
