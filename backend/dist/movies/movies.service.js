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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("./movie.entity");
let MoviesService = class MoviesService {
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }
    findAll() {
        return this.movieRepository.find();
    }
    findOne(id) {
        return this.movieRepository.findOne({ where: { id } });
    }
    findByTitle(title) {
        return this.movieRepository.findOne({ where: { title } });
    }
    async create(movie) {
        this.validateMovie(movie);
        const existing = await this.findByTitle(movie.title);
        if (existing) {
            throw new common_1.BadRequestException(`A movie with the title "${movie.title}" already exists.`);
        }
        return this.movieRepository.save(movie);
    }
    async update(id, movie) {
        this.validateMovie(movie);
        if (movie.title) {
            const existing = await this.findByTitle(movie.title);
            if (existing && existing.id !== id) {
                throw new common_1.BadRequestException(`A movie with the title "${movie.title}" already exists.`);
            }
        }
        return this.movieRepository.update(id, movie);
    }
    delete(id) {
        return this.movieRepository.delete(id);
    }
    validateMovie(movie) {
        const { title, duration, rating, releaseYear } = movie;
        if (typeof duration !== 'number' || !title || title.trim() === '')
            throw new common_1.BadRequestException('Title cannot be empty.');
        if (typeof duration !== 'number' || duration <= 0)
            throw new common_1.BadRequestException('Duration must be a positive number.');
        if (typeof rating !== 'number' || rating < 0 || rating > 10)
            throw new common_1.BadRequestException('Rating must be between 0 and 10.');
        const currentYear = new Date().getFullYear();
        if (typeof releaseYear !== 'number' || releaseYear > currentYear)
            throw new common_1.BadRequestException(`Release year can't be greater than ${currentYear}.`);
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MoviesService);
//# sourceMappingURL=movies.service.js.map