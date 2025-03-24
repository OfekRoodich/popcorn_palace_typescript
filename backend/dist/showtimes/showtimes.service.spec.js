"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const showtimes_service_1 = require("./showtimes.service");
const typeorm_1 = require("@nestjs/typeorm");
const showtime_entity_1 = require("./showtime.entity");
const movie_entity_1 = require("../movies/movie.entity");
const common_1 = require("@nestjs/common");
describe('ShowtimesService', () => {
    let service;
    let showtimeRepo;
    let movieRepo;
    const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn(),
    };
    const mockRepository = () => ({
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(() => mockQueryBuilder),
    });
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                showtimes_service_1.ShowtimesService,
                { provide: (0, typeorm_1.getRepositoryToken)(showtime_entity_1.Showtime), useFactory: mockRepository },
                { provide: (0, typeorm_1.getRepositoryToken)(movie_entity_1.Movie), useFactory: mockRepository },
            ],
        }).compile();
        service = module.get(showtimes_service_1.ShowtimesService);
        showtimeRepo = module.get((0, typeorm_1.getRepositoryToken)(showtime_entity_1.Showtime));
        movieRepo = module.get((0, typeorm_1.getRepositoryToken)(movie_entity_1.Movie));
    });
    const mockMovie = {
        id: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 120,
        rating: 8.8,
        releaseYear: 2010,
    };
    const validShowtime = {
        theater: 'Main Hall',
        price: 25,
        movieId: 1,
        startTime: new Date(Date.now() + 3600000),
    };
    it('should create a showtime successfully', async () => {
        movieRepo.findOne.mockResolvedValue(mockMovie);
        showtimeRepo.create.mockReturnValue({ id: 1 });
        showtimeRepo.save.mockResolvedValue({ id: 1 });
        mockQueryBuilder.getCount.mockResolvedValue(0);
        const result = await service.create(validShowtime);
        expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
    it('should throw if movie is not found', async () => {
        movieRepo.findOne.mockResolvedValue(null);
        await expect(service.create(validShowtime)).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw if there is an overlapping showtime', async () => {
        movieRepo.findOne.mockResolvedValue(mockMovie);
        mockQueryBuilder.getCount.mockResolvedValue(1);
        await expect(service.create(validShowtime)).rejects.toThrow(common_1.BadRequestException);
    });
    it('should update a showtime successfully', async () => {
        const updatedShowtime = { ...validShowtime, price: 30 };
        showtimeRepo.findOne.mockResolvedValue({
            id: 1,
            movie: mockMovie,
            theater: updatedShowtime.theater,
            startTime: updatedShowtime.startTime,
            endTime: new Date(updatedShowtime.startTime.getTime() + mockMovie.duration * 60000),
            price: 25,
        });
        movieRepo.findOne.mockResolvedValue(mockMovie);
        showtimeRepo.update.mockResolvedValue({});
        mockQueryBuilder.getCount.mockResolvedValue(0);
        showtimeRepo.findOne.mockResolvedValue({
            id: 1,
            movie: mockMovie,
            theater: updatedShowtime.theater,
            startTime: updatedShowtime.startTime,
            endTime: new Date(updatedShowtime.startTime.getTime() + mockMovie.duration * 60000),
            price: updatedShowtime.price,
        });
        const result = await service.update(1, updatedShowtime);
        expect(result).toEqual(expect.objectContaining({ id: 1, price: 30 }));
    });
    it('should throw if updating a non-existent showtime', async () => {
        showtimeRepo.findOne.mockResolvedValueOnce(null);
        await expect(service.update(999, validShowtime)).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw if movieId during update is invalid', async () => {
        showtimeRepo.findOne.mockResolvedValue({
            id: 1,
            movie: mockMovie,
            theater: validShowtime.theater,
            startTime: validShowtime.startTime,
            endTime: new Date(validShowtime.startTime.getTime() + mockMovie.duration * 60000),
            price: validShowtime.price,
        });
        movieRepo.findOne.mockResolvedValue(null);
        await expect(service.update(1, { ...validShowtime, movieId: 999 })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should delete a showtime', async () => {
        await service.delete(1);
        expect(showtimeRepo.delete).toHaveBeenCalledWith(1);
    });
});
//# sourceMappingURL=showtimes.service.spec.js.map