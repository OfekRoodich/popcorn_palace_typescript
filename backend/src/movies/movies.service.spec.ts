import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  const mockMovieRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const mockMovies = [{ id: 1, title: 'Test Movie' }] as Movie[];
      mockMovieRepository.find.mockResolvedValue(mockMovies);

      const result = await service.findAll();
      expect(result).toEqual(mockMovies);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });

    it('should return empty array if no movies found', async () => {
      mockMovieRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should throw if repository fails', async () => {
      mockMovieRepository.find.mockRejectedValue(new Error('DB error'));
      await expect(service.findAll()).rejects.toThrow('DB error');
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const mockMovie = { id: 1, title: 'Test Movie' } as Movie;
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });

    it('should throw if findOne fails', async () => {
      mockMovieRepository.findOne.mockRejectedValue(new Error('Find failed'));
      await expect(service.findOne(1)).rejects.toThrow('Find failed');
    });
  });

  describe('findByTitle', () => {
    it('should return movie by title', async () => {
      const mockMovie = { id: 1, title: 'Test Movie' } as Movie;
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findByTitle('Test Movie');
      expect(result).toEqual(mockMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { title: 'Test Movie' } });
    });

    it('should return null if not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      const result = await service.findByTitle('Not Found');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new movie', async () => {
      const newMovie = { title: 'New Movie' };
      const savedMovie = { id: 1, ...newMovie };
      mockMovieRepository.save.mockResolvedValue(savedMovie);

      const result = await service.create(newMovie);
      expect(result).toEqual(savedMovie);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(newMovie);
    });

    it('should throw if save fails', async () => {
      mockMovieRepository.save.mockRejectedValue(new Error('Save failed'));
      await expect(service.create({ title: 'Error' })).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update and return result', async () => {
      const updateData = { title: 'Updated Title' };
      mockMovieRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateData);
      expect(result).toEqual({ affected: 1 });
      expect(mockMovieRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 0 affected if movie not found', async () => {
      mockMovieRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(999, { title: 'Nothing' });
      expect(result).toEqual({ affected: 0 });
    });

    it('should throw if update fails', async () => {
      mockMovieRepository.update.mockRejectedValue(new Error('Update failed'));
      await expect(service.update(1, { title: 'Test' })).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete and return result', async () => {
      mockMovieRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockMovieRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return 0 affected if movie not found', async () => {
      mockMovieRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.delete(123);
      expect(result).toEqual({ affected: 0 });
    });

    it('should throw if delete fails', async () => {
      mockMovieRepository.delete.mockRejectedValue(new Error('Delete failed'));
      await expect(service.delete(1)).rejects.toThrow('Delete failed');
    });
  });
});