import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma } from '@prisma/client';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        status: 'pending',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      const expectedResult = {
        id: 1,
        ...createOrderDto,
      };

      mockOrderService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders = [
        {
          id: 1,
          status: 'pending',
          price: new Prisma.Decimal('100.00'),
          quantity: 10,
          assetWalletId: 1,
        },
        {
          id: 2,
          status: 'completed',
          price: new Prisma.Decimal('200.00'),
          quantity: 5,
          assetWalletId: 2,
        },
      ];

      mockOrderService.findAll.mockResolvedValue(orders);

      const result = await controller.findAll();

      expect(result).toEqual(orders);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const id = '1';
      const order = {
        id: 1,
        status: 'pending',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      mockOrderService.findOne.mockResolvedValue(order);

      const result = await controller.findOne(id);

      expect(result).toEqual(order);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const id = '1';
      const updateOrderDto: UpdateOrderDto = {
        status: 'completed',
      };

      const updatedOrder = {
        id: 1,
        status: 'completed',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      mockOrderService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update(id, updateOrderDto);

      expect(result).toEqual(updatedOrder);
      expect(service.update).toHaveBeenCalledWith(+id, updateOrderDto);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const id = '1';
      const expectedResult = { message: `Order #${id} removed` };

      mockOrderService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
