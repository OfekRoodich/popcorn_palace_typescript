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
  
  async update(id: number, data: Partial<Showtime>): Promise<Showtime> {
    const existing = await this.showtimeRepository.findOne({ where: { id }, relations: ['theater'] });
    if (!existing) throw new NotFoundException(`Showtime with ID ${id} not found`);
  
    const updateData: any = {
      startTime: data.startTime,
      price: data.price,
    };
  
    let recreateMatrix = false;
    let rows = 0;
    let cols = 0;
  
    // 👇 Check if theaterId changed
    if ((data as any).theaterId && (data as any).theaterId !== existing.theater.id) {
      if (existing.bookedCount > 0) {
        throw new BadRequestException("⚠️ Cannot change theater for a showtime with booked tickets.");
      }
  
      const newTheater = await this.theaterRepository.findOne({ where: { id: (data as any).theaterId } });
      if (!newTheater) throw new NotFoundException(`Theater with ID ${(data as any).theaterId} not found`);
  
      rows = newTheater.numberOfRows;
      cols = newTheater.numberOfColumns;
      recreateMatrix = true;
      updateData.theater = { id: (data as any).theaterId };
    }
  
    if (data.movieId) {
      updateData.movie = { id: data.movieId };
    }
  
    // 👇 Only allow matrix recreation if no seats are booked
    if (recreateMatrix) {
      updateData.seatMatrix = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => 0)
      );
      updateData.bookedCount = 0;
    }
  
    await this.showtimeRepository.update(id, updateData);
  
    return this.showtimeRepository.findOne({ where: { id }, relations: ['movie', 'theater'] });
  }
  
  

  async delete(id: number): Promise<any> {
    return this.showtimeRepository.delete(id);
  }


}
