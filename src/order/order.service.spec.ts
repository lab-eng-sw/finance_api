// order.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService & {
    order: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    wallet: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    asset: {
      findFirst: jest.Mock;
    };
    orderAsset: {
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    const prismaServiceMock = {
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      wallet: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      asset: {
        findFirst: jest.fn(),
      },
      orderAsset: {
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService) as typeof prisma & {
      order: typeof prisma;
    };;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        walletId: 1,
        assets: [
          { ticker: 'AAPL', quantity: 10 },
          { ticker: 'GOOG', quantity: 5 },
        ],
      };

      const wallet = {
        id: 1,
        totalInvested: new Prisma.Decimal(1000),
      };

      const assets = [
        {
          id: 1,
          ticker: 'AAPL',
          price: new Prisma.Decimal(150),
        },
        {
          id: 2,
          ticker: 'GOOG',
          price: new Prisma.Decimal(2000),
        },
      ];

      const createdOrder = {
        id: 1,
        status: 'CONFIRMED',
        price: new Prisma.Decimal(11500), // 10 * 150 + 5 * 2000
        quantity: 15,
        walletId: 1,
        assets: [
          {
            assetId: 1,
            quantity: 10,
            price: new Prisma.Decimal(150),
            asset: assets[0],
          },
          {
            assetId: 2,
            quantity: 5,
            price: new Prisma.Decimal(2000),
            asset: assets[1],
          },
        ],
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.wallet.findUnique.mockResolvedValue(wallet);
      prisma.asset.findFirst
        .mockResolvedValueOnce(assets[0])
        .mockResolvedValueOnce(assets[1]);
      prisma.order.create.mockResolvedValue(createdOrder);
      prisma.wallet.update.mockResolvedValue({
        ...wallet,
        totalInvested: wallet.totalInvested.plus(new Prisma.Decimal(11500)),
      });

      const result = await service.create(createOrderDto);

      expect(result).toEqual(createdOrder);
      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: createOrderDto.walletId },
      });
      expect(prisma.asset.findFirst).toHaveBeenCalledTimes(2);
      expect(prisma.order.create).toHaveBeenCalled();
      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { id: createOrderDto.walletId },
        data: {
          totalInvested: wallet.totalInvested.plus(new Prisma.Decimal(11500)),
        },
      });
    });

    it('should throw NotFoundException if wallet not found', async () => {
      const createOrderDto: CreateOrderDto = {
        walletId: 1,
        assets: [{ ticker: 'AAPL', quantity: 10 }],
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.wallet.findUnique.mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: createOrderDto.walletId },
      });
    });

    it('should throw NotFoundException if asset not found', async () => {
      const createOrderDto: CreateOrderDto = {
        walletId: 1,
        assets: [{ ticker: 'AAPL', quantity: 10 }],
      };

      const wallet = {
        id: 1,
        totalInvested: new Prisma.Decimal(1000),
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.wallet.findUnique.mockResolvedValue(wallet);
      prisma.asset.findFirst.mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { ticker: 'AAPL' },
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders = [
        { id: 1, status: 'CONFIRMED', price: new Prisma.Decimal(1000) },
        { id: 2, status: 'PENDING', price: new Prisma.Decimal(500) },
      ];

      prisma.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(result).toEqual(orders);
      expect(prisma.order.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no orders found', async () => {
      prisma.order.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);

      expect(prisma.order.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the order if found', async () => {
      const order = {
        id: 1,
        status: 'CONFIRMED',
        price: new Prisma.Decimal(1000),
      };

      prisma.order.findUnique.mockResolvedValue(order);

      const result = await service.findOne(1);

      expect(result).toEqual(order);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'COMPLETED',
        assets: [{ ticker: 'AAPL', quantity: 5 }],
      };

      const existingOrder = {
        id: 1,
        status: 'CONFIRMED',
        price: new Prisma.Decimal(1000),
        quantity: 10,
        assets: [],
      };

      const asset = {
        id: 1,
        ticker: 'AAPL',
        price: new Prisma.Decimal(150),
      };

      const updatedOrder = {
        id: 1,
        status: 'COMPLETED',
        price: new Prisma.Decimal(750),
        quantity: 5,
        assets: [
          {
            assetId: 1,
            quantity: 5,
            price: new Prisma.Decimal(150),
            asset: asset,
          },
        ],
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.order.findUnique.mockResolvedValue(existingOrder);
      prisma.orderAsset.deleteMany.mockResolvedValue({ count: 0 });
      prisma.asset.findFirst.mockResolvedValue(asset);
      prisma.order.update.mockResolvedValue(updatedOrder);

      const result = await service.update(1, updateOrderDto);

      expect(result).toEqual(updatedOrder);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { assets: true },
      });
      expect(prisma.orderAsset.deleteMany).toHaveBeenCalledWith({
        where: { orderId: 1 },
      });
      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { ticker: 'AAPL' },
        orderBy: { date: 'desc' },
      });
      expect(prisma.order.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if order not found', async () => {
      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { assets: true },
      });
    });

    it('should throw NotFoundException if asset not found during update', async () => {
      const updateOrderDto: UpdateOrderDto = {
        assets: [{ ticker: 'AAPL', quantity: 5 }],
      };

      const existingOrder = {
        id: 1,
        status: 'CONFIRMED',
        price: new Prisma.Decimal(1000),
        quantity: 10,
        assets: [],
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.order.findUnique.mockResolvedValue(existingOrder);
      prisma.orderAsset.deleteMany.mockResolvedValue({ count: 0 });
      prisma.asset.findFirst.mockResolvedValue(null);

      await expect(service.update(1, updateOrderDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { ticker: 'AAPL' },
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      const deletedOrder = {
        id: 1,
        status: 'CONFIRMED',
        price: new Prisma.Decimal(1000),
      };

      prisma.order.delete.mockResolvedValue(deletedOrder);

      const result = await service.remove(1);

      expect(result).toEqual(deletedOrder);
      expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if order not found during deletion', async () => {
      const prismaError = {
        code: 'P2025',
        message: 'Record not found',
      };

      prisma.order.delete.mockRejectedValue(prismaError);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);

      expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
