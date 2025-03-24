"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const showtime_entity_1 = require("./showtime.entity");
const movie_entity_1 = require("../movies/movie.entity");
let ShowtimesService = class ShowtimesService {
    constructor(showtimeRepository, movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }
    async findAll() {
        return this.showtimeRepository.find({ relations: ['movie'] });
    }
    async findById(id) {
        return this.showtimeRepository.findOne({ where: { id }, relations: ['movie'] });
    }
    async getShowtimeById(id) {
        const showtime = await this.showtimeRepository.findOne({ where: { id } });
        if (!showtime) {
            throw new common_1.NotFoundException(`Showtime with id ${id} not found`);
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
    async findAllForTheater(theater) {
        return this.showtimeRepository.find({
            where: { theater },
            relations: ['movie'],
        });
    }
    async create(data) {
        if (!data.theater || typeof data.theater !== 'string' || !data.theater.trim()) {
            throw new common_1.BadRequestException('Theater name must be a non-empty string');
        }
        if (Number(data.price) <= 0) {
            throw new common_1.BadRequestException('Showtime price must be greater than 0');
        }
        if (!data.movieId || typeof data.movieId !== 'number' || data.movieId <= 0) {
            throw new common_1.BadRequestException('Movie ID must be a positive integer');
        }
        const parsedStartTime = new Date(data.startTime);
        if (isNaN(parsedStartTime.getTime())) {
            throw new common_1.BadRequestException('startTime must be a valid date');
        }
        const year1900 = new Date('1900-01-01');
        const now = new Date();
        if (parsedStartTime < year1900) {
            throw new common_1.BadRequestException('startTime cannot be before the year 1900');
        }
        if (parsedStartTime <= now) {
            throw new common_1.BadRequestException('startTime must be in the future');
        }
        const movie = await this.movieRepository.findOne({ where: { id: data.movieId } });
        if (!movie) {
            throw new common_1.BadRequestException(`Movie with ID ${data.movieId} not found`);
        }
        const parsedEndTime = data.endTime ? new Date(data.endTime) : new Date(parsedStartTime.getTime() + movie.duration * 60000);
        if (isNaN(parsedEndTime.getTime())) {
            throw new common_1.BadRequestException('endTime must be a valid date');
        }
        if (parsedEndTime <= parsedStartTime) {
            throw new common_1.BadRequestException('endTime must be later than startTime');
        }
        const isOverlap = await this.hasOverlap(data.theater, parsedStartTime, parsedEndTime);
        if (isOverlap) {
            throw new common_1.BadRequestException('This theater already has a movie scheduled at that time');
        }
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
    async update(id, data) {
        const existing = await this.showtimeRepository.findOne({ where: { id }, relations: ['movie'] });
        if (!existing) {
            throw new common_1.BadRequestException(`Showtime with ID ${id} not found`);
        }
        const updateData = {};
        const theater = data.theater ?? existing.theater;
        if (data.theater !== undefined && (!data.theater.trim() || typeof data.theater !== 'string')) {
            throw new common_1.BadRequestException('Theater name must be a non-empty string');
        }
        if (data.price !== undefined && Number(data.price) <= 0) {
            throw new common_1.BadRequestException('Showtime price must be greater than 0');
        }
        let movie = existing.movie;
        if (data.movieId !== undefined && data.movieId !== existing.movie.id) {
            if (data.movieId <= 0) {
                throw new common_1.BadRequestException('Movie ID must be a positive integer');
            }
            movie = await this.movieRepository.findOne({ where: { id: data.movieId } });
            if (!movie) {
                throw new common_1.BadRequestException(`Movie with ID ${data.movieId} not found`);
            }
            updateData.movie = { id: data.movieId };
        }
        const startTime = data.startTime ? new Date(data.startTime) : existing.startTime;
        if (data.startTime !== undefined) {
            if (isNaN(startTime.getTime())) {
                throw new common_1.BadRequestException('startTime must be a valid date');
            }
            const year1900 = new Date('1900-01-01');
            const now = new Date();
            if (startTime < year1900) {
                throw new common_1.BadRequestException('startTime cannot be before the year 1900');
            }
            if (startTime <= now) {
                throw new common_1.BadRequestException('startTime must be in the future');
            }
        }
        const endTime = data.endTime
            ? new Date(data.endTime)
            : new Date(startTime.getTime() + movie.duration * 60000);
        if (data.endTime !== undefined && isNaN(endTime.getTime())) {
            throw new common_1.BadRequestException('endTime must be a valid date');
        }
        if (endTime <= startTime) {
            throw new common_1.BadRequestException('endTime must be later than startTime');
        }
        const isOverlap = await this.hasOverlap(theater, startTime, endTime, id);
        if (isOverlap) {
            throw new common_1.BadRequestException('This theater already has a movie scheduled at that time');
        }
        updateData.theater = theater;
        updateData.price = data.price ?? existing.price;
        updateData.startTime = startTime;
        updateData.endTime = endTime;
        await this.showtimeRepository.update(id, updateData);
        return this.findById(id);
    }
    async delete(id) {
        await this.showtimeRepository.delete(id);
    }
    async hasOverlap(theater, startTime, endTime, myId) {
        const query = this.showtimeRepository
            .createQueryBuilder('showtime')
            .where('showtime.theater = :theater', { theater })
            .andWhere('showtime.startTime < :endTime AND showtime.endTime > :startTime', {
            startTime,
            endTime,
        });
        if (myId) {
            query.andWhere('showtime.id != :excludeId', { excludeId: myId });
        }
        const count = await query.getCount();
        return count > 0;
    }
};
exports.ShowtimesService = ShowtimesService;
exports.ShowtimesService = ShowtimesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(showtime_entity_1.Showtime)),
    __param(1, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ShowtimesService);
//# sourceMappingURL=showtimes.service.js.map