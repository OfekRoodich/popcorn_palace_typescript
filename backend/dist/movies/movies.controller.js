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
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const movies_service_1 = require("./movies.service");
let MoviesController = class MoviesController {
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    findAll() {
        return this.moviesService.findAll();
    }
    async create(movie) {
        if (!movie.title || !movie.title.trim())
            throw new common_1.BadRequestException("Movie title can't be empty");
        if (!movie.genre || !movie.genre.trim())
            throw new common_1.BadRequestException("Movie genre can't be empty");
        if (movie.duration === undefined || movie.duration === null)
            throw new common_1.BadRequestException("Movie duration can't be empty");
        if (movie.rating === undefined || movie.rating === null)
            throw new common_1.BadRequestException("Movie rating can't be empty");
        if (movie.releaseYear === undefined || movie.releaseYear === null)
            throw new common_1.BadRequestException("Movie release year can't be empty");
        if (typeof movie.duration !== 'number')
            throw new common_1.BadRequestException("Movie duration must be a number");
        if (typeof movie.rating !== 'number')
            throw new common_1.BadRequestException("Movie rating must be a number");
        if (typeof movie.releaseYear !== 'number')
            throw new common_1.BadRequestException("Movie release year must be a number");
        if (movie.duration <= 0)
            throw new common_1.BadRequestException("Movie duration must be a positive number");
        if (movie.rating > 10.0 || movie.rating < 0)
            throw new common_1.BadRequestException("Movie rating must be between 0 to 10");
        if (movie.releaseYear < 1900)
            throw new common_1.BadRequestException("Movie release year is too old");
        if (movie.releaseYear > new Date().getFullYear())
            throw new common_1.BadRequestException("Release year can't be in the future");
        return this.moviesService.create(movie);
    }
    async updateByTitle(title, movie) {
        if (!movie.title || !movie.title.trim())
            throw new common_1.BadRequestException("Movie title is empty or missing");
        if (!movie.genre || !movie.genre.trim())
            throw new common_1.BadRequestException("Movie is empty or missing");
        if (movie.duration === undefined || movie.duration === null)
            throw new common_1.BadRequestException("Movie is empty or missing");
        if (movie.rating === undefined || movie.rating === null)
            throw new common_1.BadRequestException("Movie is empty or missing");
        if (movie.releaseYear === undefined || movie.releaseYear === null)
            throw new common_1.BadRequestException("Movie is empty or missing");
        if (typeof movie.duration !== 'number')
            throw new common_1.BadRequestException("Movie duration must be a number");
        if (typeof movie.rating !== 'number')
            throw new common_1.BadRequestException("Movie rating must be a number");
        if (typeof movie.releaseYear !== 'number')
            throw new common_1.BadRequestException("Movie release year must be a number");
        if (movie.duration <= 0)
            throw new common_1.BadRequestException("Movie duration must be a positive number");
        if (movie.rating > 10.0 || movie.rating < 0)
            throw new common_1.BadRequestException("Movie rating must be between 0 to 10");
        if (movie.releaseYear < 1900)
            throw new common_1.BadRequestException("Movie release year is too old");
        if (movie.releaseYear > new Date().getFullYear())
            throw new common_1.BadRequestException("Release year can't be in the future");
        const existing = await this.moviesService.findByTitle(title);
        if (!existing)
            throw new common_1.NotFoundException(`Movie "${title}" not found`);
        await this.moviesService.update(existing.id, movie);
        return movie;
    }
    async deleteByTitle(title) {
        const existing = await this.moviesService.findByTitle(title);
        if (!existing)
            throw new common_1.NotFoundException(`Movie "${title}" not found`);
        await this.moviesService.delete(existing.id);
    }
    async findOne(id) {
        const movie = await this.moviesService.findOne(id);
        if (!movie)
            throw new common_1.NotFoundException(`Movie with ID ${id} was not found`);
        return movie;
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update/:title'),
    __param(0, (0, common_1.Param)('title')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "updateByTitle", null);
__decorate([
    (0, common_1.Delete)(':title'),
    __param(0, (0, common_1.Param)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "deleteByTitle", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findOne", null);
exports.MoviesController = MoviesController = __decorate([
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map