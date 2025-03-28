"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const movies_service_1 = require("./movies.service");
const movies_controller_1 = require("./movies.controller");
const common_1 = require("@nestjs/common");
describe('MoviesController', () => {
    let controller;
    let service;
    const mockMovie = {
        id: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 120,
        rating: 8.8,
        releaseYear: 2010,
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [movies_controller_1.MoviesController],
            providers: [
                {
                    provide: movies_service_1.MoviesService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findByTitle: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();
        controller = module.get(movies_controller_1.MoviesController);
        service = module.get(movies_service_1.MoviesService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should return all movies', async () => {
        service.findAll.mockResolvedValue([mockMovie]);
        const result = await controller.findAll();
        expect(result).toEqual([mockMovie]);
    });
    it('should create a valid movie', async () => {
        service.create.mockResolvedValue(mockMovie);
        const result = await controller.create({ ...mockMovie });
        expect(result).toEqual(mockMovie);
    });
    it('should throw for missing movie title on create', async () => {
        await expect(controller.create({ genre: 'Drama' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for missing movie genre on create', async () => {
        await expect(controller.create({ title: 'Title' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for missing duration on create', async () => {
        await expect(controller.create({ title: 'Title', genre: 'Drama' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for missing rating on create', async () => {
        await expect(controller.create({ ...mockMovie, rating: undefined })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for missing releaseYear on create', async () => {
        await expect(controller.create({ ...mockMovie, releaseYear: undefined })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for non-number duration', async () => {
        await expect(controller.create({ ...mockMovie, duration: 'abc' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for non-number rating', async () => {
        await expect(controller.create({ ...mockMovie, rating: 'high' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for non-number releaseYear', async () => {
        await expect(controller.create({ ...mockMovie, releaseYear: 'future' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for negative duration', async () => {
        await expect(controller.create({ ...mockMovie, duration: -10 })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for rating over 10', async () => {
        await expect(controller.create({ ...mockMovie, rating: 11 })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for rating below 0', async () => {
        await expect(controller.create({ ...mockMovie, rating: -1 })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for release year too old', async () => {
        await expect(controller.create({ ...mockMovie, releaseYear: 1800 })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for release year in the future', async () => {
        const futureYear = new Date().getFullYear() + 1;
        await expect(controller.create({ ...mockMovie, releaseYear: futureYear })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should update movie by title', async () => {
        service.findByTitle.mockResolvedValue(mockMovie);
        const updated = { ...mockMovie, duration: 130 };
        const result = await controller.updateByTitle('Inception', updated);
        expect(result).toEqual(updated);
    });
    it('should throw if movie to update not found', async () => {
        service.findByTitle.mockResolvedValue(null);
        await expect(controller.updateByTitle('Unknown', mockMovie)).rejects.toThrow(common_1.NotFoundException);
    });
    it('should delete movie by title', async () => {
        service.findByTitle.mockResolvedValue(mockMovie);
        await controller.deleteByTitle('Inception');
        expect(service.delete).toHaveBeenCalledWith(mockMovie.id);
    });
    it('should throw if movie to delete not found', async () => {
        service.findByTitle.mockResolvedValue(null);
        await expect(controller.deleteByTitle('Unknown')).rejects.toThrow(common_1.NotFoundException);
    });
    it('should return movie by ID', async () => {
        service.findOne.mockResolvedValue(mockMovie);
        const result = await controller.findOne(1);
        expect(result).toEqual(mockMovie);
    });
    it('should throw if movie by ID not found', async () => {
        service.findOne.mockResolvedValue(null);
        await expect(controller.findOne(99)).rejects.toThrow(common_1.NotFoundException);
    });
});
//# sourceMappingURL=movies.controller.spec.js.map