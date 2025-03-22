import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number): Promise<Theater | null> {
    if (isNaN(Number(id)) || id <= 0) {
      throw new BadRequestException('⚠️ Theater ID must be a positive integer');
    }
    const theater = await this.theaterRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }

    return theater;
  }

  async create(theater: Partial<Theater>): Promise<Theater> {
    if (!theater.name || theater.name.trim().length === 0) {
      throw new BadRequestException("⚠️ Theater name can't be empty");
    }

    if (
      theater.numberOfRows == null ||
      theater.numberOfRows <= 0 ||
      !Number.isInteger(theater.numberOfRows)
    ) {
      throw new BadRequestException('⚠️ Number of rows must be a positive integer');
    }

    if (
      theater.numberOfColumns == null ||
      theater.numberOfColumns <= 0 ||
      !Number.isInteger(theater.numberOfColumns)
    ) {
      throw new BadRequestException('⚠️ Number of Columns must be a positive integer');
    }

    return this.theaterRepository.save(theater);
  }

  async update(id: number, theater: Partial<Theater>): Promise<any> {
    if (isNaN(Number(id)) || id <= 0) {
      throw new BadRequestException('Invalid theater ID');
    }

    const existing = await this.theaterRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }

    if (!theater.name || !theater.name.trim) {
      throw new BadRequestException("⚠️ Theater name can't be empty");
    }

    if (
      theater.numberOfRows != null &&
      (theater.numberOfRows <= 0 || !Number.isInteger(theater.numberOfRows))
    ) {
      throw new BadRequestException('⚠️ Number of Rows must be a positive integer');
    }

    if (
      theater.numberOfColumns != null &&
      (theater.numberOfColumns <= 0 || !Number.isInteger(theater.numberOfColumns))
    ) {
      throw new BadRequestException('⚠️ Number of Columns must be a positive integer');
    }

    return this.theaterRepository.update(id, theater);
  }

  async delete(id: number): Promise<any> {
    if (isNaN(Number(id)) || Number(id) <= 0) {
      throw new BadRequestException('⚠️ Theater ID must be a positive integer');
    }

    const existing = await this.theaterRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }

    return this.theaterRepository.delete(id);
  }
}
