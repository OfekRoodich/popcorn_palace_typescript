import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { Theater } from '../theaters/theater.entity';
import { Movie } from '../movies/movie.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,

    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Showtime[]> {
    return this.showtimeRepository.find({ relations: ['movie', 'theater'] });
  }

  async findById(id: number): Promise<Showtime> {
    return this.showtimeRepository.findOne({ where: { id }, relations: ['movie', 'theater'] });
  }

  async findAllForTheater(theaterId: number): Promise<Showtime[]> {
    return this.showtimeRepository
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.theater', 'theater')
      .where('theater.id = :theaterId', { theaterId })
      .getMany();
  }

  async create(data: Partial<Showtime>): Promise<Showtime> {
    const theater = await this.theaterRepository.findOne({ where: { id: data.theaterId } });
    const movie = await this.movieRepository.findOne({ where: { id: data.movieId } });

    if (!theater) throw new Error('Theater not found');
    if (!movie) throw new Error('Movie not found');

    const rows = theater.numberOfRows;
    const cols = theater.numberOfColumns;
    const seatMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));

    const startTime = new Date(data.startTime);
    const endTime = new Date(startTime.getTime() + movie.duration * 60000);

    const isOverlap = await this.hasOverlap(theater.id, startTime, endTime);
    if (isOverlap) {
      throw new BadRequestException('⚠️ This theater already has a movie scheduled at that time');
    }

    const showtime = this.showtimeRepository.create({
      movie: { id: data.movieId },
      theater: { id: data.theaterId },
      startTime,
      endTime,
      price: data.price,
      seatMatrix,
      bookedCount: 0,
    });

    const saved = await this.showtimeRepository.save(showtime);
    return this.findById(saved.id);
  }

  async update(id: number, data: Partial<Showtime>): Promise<Showtime> {
    const existing = await this.showtimeRepository.findOne({ where: { id }, relations: ['theater', 'movie'] });
    if (!existing) throw new Error(`Showtime with ID ${id} not found`);
  
    const updateData: any = {
      startTime: data.startTime,
      price: data.price,
    };
  
    let recreateMatrix = false;
    let targetTheater = existing.theater;
  
    if (data.theaterId && data.theaterId !== existing.theater.id) {
      if (existing.bookedCount > 0) {
        throw new Error('⚠️ Cannot change theater for a showtime with booked tickets.');
      }
  
      targetTheater = await this.theaterRepository.findOne({ where: { id: data.theaterId } });
      if (!targetTheater) throw new Error(`Theater with ID ${data.theaterId} not found`);
  
      updateData.theater = { id: data.theaterId };
      updateData.seatMatrix = Array.from({ length: targetTheater.numberOfRows }, () =>
        Array(targetTheater.numberOfColumns).fill(0)
      );
      updateData.bookedCount = 0;
      recreateMatrix = true;
    }
  
    let movie = existing.movie;
  
    if (data.movieId && data.movieId !== existing.movie.id) {
      movie = await this.movieRepository.findOne({ where: { id: data.movieId } });
      if (!movie) throw new Error(`Movie with ID ${data.movieId} not found`);
      updateData.movie = { id: data.movieId };
    }
  
    if (data.startTime && movie?.duration) {
      const start = new Date(data.startTime);
      const end = new Date(start.getTime() + movie.duration * 60000);
  
      const overlap = await this.hasOverlap(targetTheater.id, start, end, existing.id);
      if (overlap) {
        throw new BadRequestException('⚠️ This theater already has a movie scheduled at that time');
      }
  
      updateData.endTime = end;
    }
  
    await this.showtimeRepository.update(id, updateData);
    return this.findById(id);
  }
  

  async updateSeatMatrix(id: number, selectedSeats: [number, number][]): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({ where: { id } });
    if (!showtime) throw new Error(`Showtime ${id} not found`);

    const seatMatrix = showtime.seatMatrix;
    for (const [row, col] of selectedSeats) {
      if (seatMatrix[row][col] === 2) {
        throw new Error(`⚠️ Seat ${col + 1} on row ${row + 1} is already booked.`);
      }
      seatMatrix[row][col] = 2;
    }

    await this.showtimeRepository.update(id, {
      seatMatrix,
      bookedCount: seatMatrix.flat().filter(s => s === 2).length,
    });

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.showtimeRepository.delete(id);
  }

  private async hasOverlap(
    theaterId: number,
    startTime: Date,
    endTime: Date,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.theaterId = :theaterId', { theaterId })
      .andWhere('showtime.startTime < :endTime AND showtime.endTime > :startTime', {
        startTime,
        endTime,
      });

    if (excludeId) {
      query.andWhere('showtime.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}
