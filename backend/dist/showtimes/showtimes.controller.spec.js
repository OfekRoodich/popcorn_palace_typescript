"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const showtimes_controller_1 = require("./showtimes.controller");
const showtimes_service_1 = require("./showtimes.service");
const movies_service_1 = require("../movies/movies.service");
const common_1 = require("@nestjs/common");
describe('ShowtimesController', () => {
    let controller;
    let showtimesService;
    let moviesService;
    const mockShowtimesService = {
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const mockMoviesService = {
        findOne: jest.fn(),
    };
    const validShowtime = {
        movieId: 1,
        theater: 'Cinema 1',
        price: 15,
        startTime: new Date(Date.now() + 3600000),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [showtimes_controller_1.ShowtimesController],
            providers: [
                { provide: showtimes_service_1.ShowtimesService, useValue: mockShowtimesService },
                { provide: movies_service_1.MoviesService, useValue: mockMoviesService },
            ],
        }).compile();
        controller = module.get(showtimes_controller_1.ShowtimesController);
        showtimesService = module.get(showtimes_service_1.ShowtimesService);
        moviesService = module.get(movies_service_1.MoviesService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should call findById()', async () => {
        const showtime = { id: 1 };
        mockShowtimesService.findById.mockResolvedValue(showtime);
        const result = await controller.getShowtimeById(1);
        expect(result).toEqual(showtime);
        expect(showtimesService.findById).toHaveBeenCalledWith(1);
    });
    it('should create a valid showtime', async () => {
        mockMoviesService.findOne.mockResolvedValue({ id: 1 });
        mockShowtimesService.create.mockResolvedValue({ id: 10 });
        const result = await controller.create(validShowtime);
        expect(result).toEqual({ id: 10 });
        expect(moviesService.findOne).toHaveBeenCalledWith(1);
        expect(showtimesService.create).toHaveBeenCalledWith(validShowtime);
    });
    it('should throw if movie not found on create', async () => {
        mockMoviesService.findOne.mockResolvedValue(null);
        await expect(controller.create(validShowtime)).rejects.toThrow(common_1.NotFoundException);
    });
    it('should update a valid showtime', async () => {
        mockMoviesService.findOne.mockResolvedValue({ id: 1 });
        mockShowtimesService.update.mockResolvedValue({
            id: 10,
            price: 15,
            movie: { id: 1 },
            theater: 'Cinema 1',
            startTime: validShowtime.startTime,
            endTime: new Date(Date.now() + 7200000).toISOString(),
        });
        const result = await controller.update(10, validShowtime);
        expect(result).toHaveProperty('id', 10);
        expect(showtimesService.update).toHaveBeenCalledWith(10, validShowtime);
    });
    it('should throw if movie not found on update', async () => {
        mockMoviesService.findOne.mockResolvedValue(null);
        await expect(controller.update(10, validShowtime)).rejects.toThrow(common_1.NotFoundException);
    });
    it('should call delete()', async () => {
        mockShowtimesService.delete.mockResolvedValue(undefined);
        await controller.delete(1);
        expect(showtimesService.delete).toHaveBeenCalledWith(1);
    });
    it('should throw if movieId is NaN', () => {
        const bad = { ...validShowtime, movieId: 'abc' };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if theater is missing', () => {
        const bad = { ...validShowtime, theater: '' };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if price is missing or 0', () => {
        const bad = { ...validShowtime, price: 0 };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if startTime is missing', () => {
        const bad = { ...validShowtime };
        delete bad.startTime;
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if startTime is invalid', () => {
        const bad = { ...validShowtime, startTime: 'not-a-date' };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if startTime is before 1900', () => {
        const bad = { ...validShowtime, startTime: '1800-01-01T00:00:00Z' };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if startTime is in the past', () => {
        const bad = { ...validShowtime, startTime: new Date(Date.now() - 10000).toISOString() };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if price is negative', () => {
        const bad = { ...validShowtime, price: -10 };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
    it('should throw if movieId <= 0', () => {
        const bad = { ...validShowtime, movieId: 0 };
        expect(() => controller['validateShowtime'](bad)).toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=showtimes.controller.spec.js.map