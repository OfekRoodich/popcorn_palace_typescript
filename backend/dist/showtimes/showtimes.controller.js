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
exports.ShowtimesController = void 0;
const common_1 = require("@nestjs/common");
const showtimes_service_1 = require("./showtimes.service");
const movies_service_1 = require("../movies/movies.service");
let ShowtimesController = class ShowtimesController {
    constructor(showtimesService, moviesService) {
        this.showtimesService = showtimesService;
        this.moviesService = moviesService;
    }
    getShowtimeById(id) {
        return this.showtimesService.getShowtimeById(id);
    }
    async create(showtime) {
        this.validateShowtime(showtime);
        const movie = await this.moviesService.findOne(showtime.movieId);
        if (!movie)
            throw new common_1.NotFoundException(`Movie with ID ${showtime.movieId} not found`);
        return this.showtimesService.create(showtime);
    }
    async update(id, showtime) {
        this.validateShowtime(showtime);
        const movie = await this.moviesService.findOne(showtime.movieId);
        if (!movie)
            throw new common_1.NotFoundException(`Movie with ID ${showtime.movieId} not found`);
        const updated = await this.showtimesService.update(id, showtime);
        return { "id": updated.id, "price": updated.price, "movieId": updated.movie.id, "theater": updated.theater, "startTime": updated.startTime, "endTime": updated.endTime };
    }
    delete(id) {
        return this.showtimesService.delete(id);
    }
    validateShowtime(showtime) {
        if (showtime.movieId === undefined || showtime.movieId === null)
            throw new common_1.BadRequestException('Mmovie Id is missing or empty');
        if (!showtime.theater || !showtime.theater.trim())
            throw new common_1.BadRequestException('Theater name is missing or empty');
        if (showtime.price === undefined || showtime.price === null)
            throw new common_1.BadRequestException("Price is missing or empty");
        if (!showtime.startTime)
            throw new common_1.BadRequestException('Start time must be selected');
        const startTime = new Date(showtime.startTime);
        if (isNaN(startTime.getTime()))
            throw new common_1.BadRequestException('Start Timeis missing or empty');
        if (typeof showtime.movieId !== 'number')
            throw new common_1.BadRequestException("Movie Id must be a number");
        if (typeof showtime.price !== 'number')
            throw new common_1.BadRequestException("Showtime Price must be a number");
        if (typeof showtime.theater !== 'string')
            throw new common_1.BadRequestException("Theater must be a string");
        const currentDate = new Date();
        const year1900 = new Date('1900-01-01');
        if (startTime < year1900)
            throw new common_1.BadRequestException('startTime cannot be before the year 1900');
        if (startTime < currentDate)
            throw new common_1.BadRequestException('startTime must be in the future');
        if (showtime.price <= 0)
            throw new common_1.BadRequestException('Showtime price must be greater than 0');
        if (showtime.movieId <= 0)
            throw new common_1.BadRequestException('Movie ID must be a positive integer');
    }
};
exports.ShowtimesController = ShowtimesController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "getShowtimeById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "delete", null);
exports.ShowtimesController = ShowtimesController = __decorate([
    (0, common_1.Controller)('showtimes'),
    __metadata("design:paramtypes", [showtimes_service_1.ShowtimesService,
        movies_service_1.MoviesService])
], ShowtimesController);
//# sourceMappingURL=showtimes.controller.js.map