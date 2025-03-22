import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { Theater } from '../theaters/theater.entity';


@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,

    @InjectRepository(Theater)
  private readonly theaterRepository: Repository<Theater>,
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
    const theater = await this.theaterRepository.findOne({ where: { id: (data as any).theaterId } });
  
    if (!theater) {
      throw new Error("Theater not found");
    }
  
    const rows = theater.numberOfRows;
    const cols = theater.numberOfColumns;
  
    const seatMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
  
    const showtime = this.showtimeRepository.create({
      movie: { id: data.movieId },
      theater: { id: (data as any).theaterId },
      startTime: data.startTime,
      price: data.price,
      seatMatrix,
      bookedCount: 0
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

  async updateSeatMatrix(id: number, seatMatrix: number[][]): Promise<Showtime> {
    await this.showtimeRepository.update(id, {
      seatMatrix,
      bookedCount: seatMatrix.flat().filter(seat => seat === 2).length
    });
  
    return this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie', 'theater']
    });
  }
  

}
