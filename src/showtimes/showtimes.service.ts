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

  async create(showtime: Partial<Showtime>): Promise<Showtime> {
  
    // Save showtime and return only IDs initially
    const savedShowtime = await this.showtimeRepository.save(showtime);
  
    // Fetch the full showtime with relations (movie + theater)
    const fullShowtime = await this.showtimeRepository.findOne({
      where: { id: savedShowtime.id },
      relations: ['movie', 'theater'], // ✅ Now includes 'theater'
    });
  
    return fullShowtime;
  }
  
  async findAllForTheater(theaterId: number): Promise<Showtime[]> {
    console.log("🔍 Filtering showtimes by theater ID:", theaterId);
  
    return this.showtimeRepository
      .createQueryBuilder("showtime")
      .leftJoinAndSelect("showtime.movie", "movie")
      .leftJoinAndSelect("showtime.theater", "theater")
      .where("theater.id = :theaterId", { theaterId })
      .getMany();
  }
  
  
  async update(id: number, showtime: Partial<Showtime>): Promise<any> {
    return this.showtimeRepository.update(id, showtime);
  }

  async delete(id: number): Promise<any> {
    return this.showtimeRepository.delete(id);
  }

}
