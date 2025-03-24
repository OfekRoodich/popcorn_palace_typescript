"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bookings_controller_1 = require("./bookings.controller");
const bookings_service_1 = require("./bookings.service");
const common_1 = require("@nestjs/common");
describe('BookingsController', () => {
    let controller;
    let service;
    const mockBookingsService = {
        create: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [bookings_controller_1.BookingsController],
            providers: [
                {
                    provide: bookings_service_1.BookingsService,
                    useValue: mockBookingsService,
                },
            ],
        }).compile();
        controller = module.get(bookings_controller_1.BookingsController);
        service = module.get(bookings_service_1.BookingsService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call bookingsService.create with valid input', async () => {
        const dto = { showtimeId: 1, seatNumber: 10, userId: 'user123' };
        const mockResponse = { bookingId: 42 };
        mockBookingsService.create.mockResolvedValue(mockResponse);
        const result = await controller.createBooking(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toBe(mockResponse);
    });
    it('should throw BadRequestException for missing showtimeId', async () => {
        const dto = { seatNumber: 10, userId: 'user123' };
        await expect(controller.createBooking(dto)).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw BadRequestException for invalid seatNumber', async () => {
        const dto = { showtimeId: 1, seatNumber: 0, userId: 'user123' };
        await expect(controller.createBooking(dto)).rejects.toThrow(common_1.BadRequestException);
    });
    it('should throw BadRequestException for invalid userId', async () => {
        const dto = { showtimeId: 1, seatNumber: 10, userId: ' ' };
        await expect(controller.createBooking(dto)).rejects.toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=booking.controller.spec.js.map