import { Test, TestingModule } from '@nestjs/testing';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';
import { Theater } from './theater.entity';

describe('TheatersController', () => {
  let controller: TheatersController;
  let service: TheatersService;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheatersController],
      providers: [
        {
          provide: TheatersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TheatersController>(TheatersController);
    service = module.get<TheatersService>(TheatersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all theaters', async () => {
    const result: Theater[] = [{ id: 1, name: 'Test Theater' } as Theater];
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.getAllTheaters()).toEqual(result);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should create a theater', async () => {
    const dto = { name: 'New Theater' };
    const created = { id: 1, ...dto } as Theater;
    mockService.create.mockResolvedValue(created);

    expect(await controller.create(dto)).toEqual(created);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a theater', async () => {
    const updated = { id: 1, name: 'Updated Name' };
    mockService.update.mockResolvedValue(updated);

    expect(await controller.update(1, updated)).toEqual(updated);
    expect(mockService.update).toHaveBeenCalledWith(1, updated);
  });

  it('should delete a theater', async () => {
    const deleted = { success: true };
    mockService.delete.mockResolvedValue(deleted);

    expect(await controller.delete(1)).toEqual(deleted);
    expect(mockService.delete).toHaveBeenCalledWith(1);
  });
});
