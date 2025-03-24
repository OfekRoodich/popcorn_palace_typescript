import { Injectable, BadRequestException,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { Movie } from '../movies/movie.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Showtime[]> {
    return this.showtimeRepository.find({ relations: ['movie'] });
  }

  async findById(id: number): Promise<Showtime> {
    return this.showtimeRepository.findOne({ where: { id }, relations: ['movie'] });
  }

  async getShowtimeById(id: number): Promise<any> {
    const showtime = await this.showtimeRepository.findOne({ where: { id } });
    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }
  
    return {
      id: showtime.id,
      price: showtime.price,
      movieId: showtime.movieId,
      theater: showtime.theater,
      startTime: showtime.startTime,
      endTime: showtime.endTime,
    };
  }

  async findAllForTheater(theater: string): Promise<Showtime[]> {
    return this.showtimeRepository.find({
      where: { theater },
      relations: ['movie'],
    });
  }

async create(data: Partial<Showtime>): Promise<Partial<Showtime>> {
  // 🎯 Validation
  if (!data.theater || typeof data.theater !== 'string' || !data.theater.trim()) {
    throw new BadRequestException('Theater name must be a non-empty string');
  }

  if (Number(data.price) <= 0) {
    throw new BadRequestException('Showtime price must be greater than 0');
  }

  if (!data.movieId || typeof data.movieId !== 'number' || data.movieId <= 0) {
    throw new BadRequestException('Movie ID must be a positive integer');
  }

  const parsedStartTime = new Date(data.startTime);
  if (isNaN(parsedStartTime.getTime())) {
    throw new BadRequestException('startTime must be a valid date');
  }

  const year1900 = new Date('1900-01-01');
  const now = new Date();

  if (parsedStartTime < year1900) {
    throw new BadRequestException('startTime cannot be before the year 1900');
  }

  if (parsedStartTime <= now) {
    throw new BadRequestException('startTime must be in the future');
  }

  // 🎬 Movie existence check
  const movie = await this.movieRepository.findOne({ where: { id: data.movieId } });
  if (!movie) {
    throw new BadRequestException(`Movie with ID ${data.movieId} not found`);
  }

  // ⏰ Determine endTime
  const parsedEndTime = data.endTime ? new Date(data.endTime) : new Date(parsedStartTime.getTime() + movie.duration * 60000);
  if (isNaN(parsedEndTime.getTime())) {
    throw new BadRequestException('endTime must be a valid date');
  }

  if (parsedEndTime <= parsedStartTime) {
    throw new BadRequestException('endTime must be later than startTime');
  }

  // 🚫 Check for overlapping showtimes
  const isOverlap = await this.hasOverlap(data.theater, parsedStartTime, parsedEndTime);
  if (isOverlap) {
    throw new BadRequestException('This theater already has a movie scheduled at that time');
  }

  // ✅ Create and save
  const showtime = this.showtimeRepository.create({
    movie: { id: data.movieId },
    theater: data.theater,
    startTime: parsedStartTime,
    endTime: parsedEndTime,
    price: data.price,
  });

  const saved = await this.showtimeRepository.save(showtime);

  return {
    id: saved.id,
    price: saved.price,
    movieId: data.movieId,
    theater: saved.theater,
    startTime: saved.startTime,
    endTime: saved.endTime,
  };
}

async update(id: number, data: Partial<Showtime>): Promise<Showtime> {
  const existing = await this.showtimeRepository.findOne({ where: { id }, relations: ['movie'] });
  if (!existing) {
    throw new BadRequestException(`Showtime with ID ${id} not found`);
  }

  const updateData: any = {};

  // Validate theater (if provided)
  const theater = data.theater ?? existing.theater;
  if (data.theater !== undefined && (!data.theater.trim() || typeof data.theater !== 'string')) {
    throw new BadRequestException('Theater name must be a non-empty string');
  }

  // Validate price (if provided)
  if (data.price !== undefined && Number(data.price) <= 0) {
    throw new BadRequestException('Showtime price must be greater than 0');
  }

  // Determine movie (check if updated)
  let movie = existing.movie;
  if (data.movieId !== undefined && data.movieId !== existing.movie.id) {
    if (data.movieId <= 0) {
      throw new BadRequestException('Movie ID must be a positive integer');
    }

    movie = await this.movieRepository.findOne({ where: { id: data.movieId } });
    if (!movie) {
      throw new BadRequestException(`Movie with ID ${data.movieId} not found`);
    }

    updateData.movie = { id: data.movieId };
  }

  // Handle and validate startTime
  const startTime = data.startTime ? new Date(data.startTime) : existing.startTime;
  if (data.startTime !== undefined) {
    if (isNaN(startTime.getTime())) {
      throw new BadRequestException('startTime must be a valid date');
    }

    const year1900 = new Date('1900-01-01');
    const now = new Date();

    if (startTime < year1900) {
      throw new BadRequestException('startTime cannot be before the year 1900');
    }

    if (startTime <= now) {
      throw new BadRequestException('startTime must be in the future');
    }
  }

  // Handle and validate endTime
  const endTime = data.endTime
    ? new Date(data.endTime)
    : new Date(startTime.getTime() + movie.duration * 60000);

  if (data.endTime !== undefined && isNaN(endTime.getTime())) {
    throw new BadRequestException('endTime must be a valid date');
  }

  if (endTime <= startTime) {
    throw new BadRequestException('endTime must be later than startTime');
  }

  // Overlap check
  const isOverlap = await this.hasOverlap(theater, startTime, endTime, id);
  if (isOverlap) {
    throw new BadRequestException('This theater already has a movie scheduled at that time');
  }

  // Prepare update payload
  updateData.theater = theater;
  updateData.price = data.price ?? existing.price;
  updateData.startTime = startTime;
  updateData.endTime = endTime;

  await this.showtimeRepository.update(id, updateData);
  return this.findById(id);
}


  async delete(id: number): Promise<void> {
    await this.showtimeRepository.delete(id);
  }

  private async hasOverlap(
    theater: string,
    startTime: Date,
    endTime: Date,
    myId?: number
  ): Promise<boolean> {
    const query = this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.theater = :theater', { theater })
      .andWhere('showtime.startTime < :endTime AND showtime.endTime > :startTime', { 
        startTime,
        endTime,
      });

    if (myId) {
      query.andWhere('showtime.id != :CheckedShowtimeIdToExclude', { CheckedShowtimeIdToExclude: myId });
    }

    const count = await query.getCount();
    return count > 0;
  }

}