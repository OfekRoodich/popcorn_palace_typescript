import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: jest.Mocked<Repository<Movie>>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 8.8,
    releaseYear: 2010,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get(getRepositoryToken(Movie));
  });

  it('should return all movies', async () => {
    repo.find.mockResolvedValue([mockMovie]);
    const movies = await service.findAll();
    expect(movies).toEqual([mockMovie]);
  });

  it('should find a movie by id', async () => {
    repo.findOne.mockResolvedValue(mockMovie);
    const movie = await service.findOne(1);
    expect(movie).toEqual(mockMovie);
  });

  it('should return null if movie not found by id', async () => {
    repo.findOne.mockResolvedValue(null);
    const movie = await service.findOne(999);
    expect(movie).toBeNull();
  });

  it('should find a movie by title', async () => {
    repo.findOne.mockResolvedValue(mockMovie);
    const movie = await service.findByTitle('Inception');
    expect(movie).toEqual(mockMovie);
  });

  it('should create a new movie', async () => {
    repo.save.mockResolvedValue(mockMovie);
    const movie = await service.create({ title: 'Inception', duration: 148, rating: 8.8, releaseYear: 2010 });
    expect(movie).toEqual(mockMovie);
    expect(repo.save).toHaveBeenCalledWith({ title: 'Inception', duration: 148, rating: 8.8, releaseYear: 2010 });
  });

  it('should throw an error if creating movie with invalid data', async () => {
    await expect(service.create({ title: '', duration: -10, rating: 11, releaseYear: 2050 }))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should update a movie', async () => {
    repo.update.mockResolvedValue({
      affected: 1,
      raw: {},
      generatedMaps: [],
    });
  
    const validMovie = {
      title: 'Updated Title',
      duration: 120,
      rating: 9.0,
      releaseYear: 2020,
    };
  
    const result = await service.update(1, validMovie);
  
    expect(repo.update).toHaveBeenCalledWith(1, validMovie);
    expect(result.affected).toBe(1);
  });
  

  it('should throw an error if updating movie with invalid data', async () => {
    await expect(service.update(1, { title: '', duration: 0 }))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should delete a movie', async () => {
    repo.delete.mockResolvedValue({ affected: 1, raw: {} });
    const result = await service.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result.affected).toBe(1);
  });
});
