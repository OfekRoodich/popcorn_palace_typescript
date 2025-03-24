"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
jest.mock('@nestjs/core', () => ({
    NestFactory: {
        create: jest.fn(),
    },
}));
describe('Main Bootstrap', () => {
    const mockEnableCors = jest.fn();
    const mockListen = jest.fn();
    const mockApp = {
        enableCors: mockEnableCors,
        listen: mockListen,
    };
    beforeEach(() => {
        jest.resetAllMocks();
        core_1.NestFactory.create.mockResolvedValue(mockApp);
    });
    it('should bootstrap and start listening', async () => {
        await Promise.resolve().then(() => require('./main'));
        expect(core_1.NestFactory.create).toHaveBeenCalledWith(app_module_1.AppModule);
        expect(mockEnableCors).toHaveBeenCalledWith({
            origin: 'http://localhost:3001',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        });
        expect(mockListen).toHaveBeenCalledWith(3000);
    });
});
//# sourceMappingURL=main.spec.js.map