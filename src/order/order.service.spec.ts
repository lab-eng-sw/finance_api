import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma, Order } from '@prisma/client';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        status: 'pending',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      const expectedResult: Order = {
        id: 1,
        ...createOrderDto,
      };

      mockPrismaService.order.create.mockResolvedValue(expectedResult);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: createOrderDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders: Order[] = [
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

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(result).toEqual(orders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no orders are found', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by ID', async () => {
      const order: Order = {
        id: 1,
        status: 'pending',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      mockPrismaService.order.findUnique.mockResolvedValue(order);

      const result = await service.findOne(1);

      expect(result).toEqual(order);
      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'completed',
      };

      const updatedOrder: Order = {
        id: 1,
        status: 'completed',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      const result = await service.update(1, updateOrderDto);

      expect(result).toEqual(updatedOrder);
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateOrderDto,
      });
    });

    it('should throw NotFoundException if order to update is not found', async () => {
      mockPrismaService.order.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const deletedOrder: Order = {
        id: 1,
        status: 'pending',
        price: new Prisma.Decimal('100.00'),
        quantity: 10,
        assetWalletId: 1,
      };

      mockPrismaService.order.delete.mockResolvedValue(deletedOrder);

      const result = await service.remove(1);

      expect(result).toEqual(deletedOrder);
      expect(mockPrismaService.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if order to delete is not found', async () => {
      mockPrismaService.order.delete.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
