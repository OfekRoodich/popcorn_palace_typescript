"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bookings_service_1 = require("./bookings.service");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./booking.entity");
const showtime_entity_1 = require("../showtimes/showtime.entity");
const common_1 = require("@nestjs/common");
describe('BookingsService', () => {
    let service;
    let bookingRepo;
    let showtimeRepo;
    const mockRepository = () => ({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    });
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                bookings_service_1.BookingsService,
                { provide: (0, typeorm_1.getRepositoryToken)(booking_entity_1.Booking), useFactory: mockRepository },
                { provide: (0, typeorm_1.getRepositoryToken)(showtime_entity_1.Showtime), useFactory: mockRepository },
            ],
        }).compile();
        service = module.get(bookings_service_1.BookingsService);
        bookingRepo = module.get((0, typeorm_1.getRepositoryToken)(booking_entity_1.Booking));
        showtimeRepo = module.get((0, typeorm_1.getRepositoryToken)(showtime_entity_1.Showtime));
    });
    it('should book a seat successfully', async () => {
        const bookingData = { showtimeId: 5000, seatNumber: 1, userId: 'user123' };
        bookingRepo.findOne.mockResolvedValue(null);
        showtimeRepo.findOne.mockResolvedValue({ id: 1 });
        bookingRepo.create.mockReturnValue({ bookingId: 'uuid-123', ...bookingData });
        bookingRepo.save.mockResolvedValue({ bookingId: 'uuid-123', ...bookingData });
        const result = await service.create(bookingData);
        expect(bookingRepo.save).toHaveBeenCalledWith(expect.objectContaining({
            showtimeId: 5000,
            seatNumber: 1,
            userId: 'user123',
        }));
        expect(result).toEqual({ bookingId: 'uuid-123' });
    });
    it('should throw if showtime not found', async () => {
        showtimeRepo.findOne.mockResolvedValue(null);
        await expect(service.create({ showtimeId: 999, seatNumber: 1, userId: 'user' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw if seat is already booked', async () => {
        const mockShowtime = { id: 1 };
        bookingRepo.findOne.mockResolvedValue({
            bookingId: 'uuid-existing',
            seatNumber: 1,
            showtimeId: 1,
            userId: 'user-existing',
            showtime: mockShowtime,
        });
        showtimeRepo.findOne.mockResolvedValue(mockShowtime);
        await expect(service.create({ showtimeId: 1, seatNumber: 1, userId: 'user123' })).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw for invalid seat number (out of range)', async () => {
        showtimeRepo.findOne.mockResolvedValue({ id: 1 });
        await expect(service.create({ showtimeId: 1, seatNumber: 150, userId: 'user' })).rejects.toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=bookings.service.spec.js.map