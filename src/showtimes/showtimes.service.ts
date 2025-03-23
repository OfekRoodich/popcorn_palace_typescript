import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  
  
  async updateSeatMatrix(id: number, seatMatrix: number[][]): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({ where: { id } });
  
    if (!showtime) throw new NotFoundException(`Showtime ${id} not found`);
  
    const currentSeats = showtime.seatMatrix;
    console.log("old seats:",seatMatrix)
    console.log("new seats:",currentSeats)
    for (let row = 0; row < seatMatrix.length; row++) {
      for (let col = 0; col < seatMatrix[row].length; col++) {
        const newSeat = seatMatrix[row][col];
        const oldSeat = currentSeats[row][col];
        
        if (newSeat == 3 && oldSeat == 2) {
          throw new BadRequestException(`⚠️ Seat ${col + 1} on row ${row + 1} is already booked. Refresh your page and book again`);
        }
        if (newSeat == 3 && oldSeat == 0)
            seatMatrix[row][col]=2;
      }
    }
  
    await this.showtimeRepository.update(id, {
      seatMatrix,
      bookedCount: seatMatrix.flat().filter(seat => seat === 2).length,
    });
  
    return this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie', 'theater'],
    });
  }
  
  

  async delete(id: number): Promise<any> {
    return this.showtimeRepository.delete(id);
  }


}
