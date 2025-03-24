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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const showtime_entity_1 = require("../showtimes/showtime.entity");
let BookingsService = class BookingsService {
    constructor(bookingRepository, showtimeRepository) {
        this.bookingRepository = bookingRepository;
        this.showtimeRepository = showtimeRepository;
    }
    async create(data) {
        const { showtimeId, seatNumber, userId } = data;
        if (seatNumber < 1 || seatNumber > 99) {
            throw new common_1.BadRequestException('Seat number must be between 1 and 99');
        }
        const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
        if (!showtime)
            throw new common_1.BadRequestException(`Showtime ${showtimeId} not found`);
        const existingBooking = await this.bookingRepository.findOne({
            where: { seatNumber, showtimeId },
        });
        if (existingBooking) {
            throw new common_1.BadRequestException(`Seat ${seatNumber} is already booked for showtime ${showtimeId}`);
        }
        const booking = this.bookingRepository.create({ showtimeId, seatNumber, userId });
        const saved = await this.bookingRepository.save(booking);
        return { bookingId: saved.bookingId };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(showtime_entity_1.Showtime)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map