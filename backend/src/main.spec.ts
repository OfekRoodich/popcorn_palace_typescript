// src/main.spec.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should bootstrap and start listening', async () => {
    await import('./main');

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockEnableCors).toHaveBeenCalledWith({
      origin: 'http://localhost:3001',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    expect(mockListen).toHaveBeenCalledWith(3000);
  });
});
