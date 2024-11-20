// asset.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Prisma } from '@prisma/client';

describe('AssetService', () => {
  let service: AssetService;
  let prisma: PrismaService;

  const mockPrismaService = {
    asset: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new asset', async () => {
      const createAssetDto: CreateAssetDto = {
        ticker: 'AAPL',
        volume: 1000,
        dailyVariation: new Prisma.Decimal('0.05'),
        bbi: new Prisma.Decimal('1.2'),
        sven: new Prisma.Decimal('1.5'),
        assetName: 'Apple Inc.',
        type: 'Stock',
        benchmark: 'NASDAQ',
        date: new Date('2023-01-01'),
        price: new Prisma.Decimal('150.00'),
        pl: new Prisma.Decimal('10.00'),
        macdim: new Prisma.Decimal('1.1'),
        macdis: new Prisma.Decimal('1.2'),
        macdh: new Prisma.Decimal('1.3'),
        bbs: new Prisma.Decimal('1.0'),
        bbl: new Prisma.Decimal('0.9'),
        bbm: new Prisma.Decimal('1.0'),
        rsicom: new Prisma.Decimal('30'),
        rsivem: new Prisma.Decimal('70'),
        // Optional fields
        rsi: 50,
        scom: new Prisma.Decimal('1.4'),
      };

      const expectedResult = {
        id: 1,
        ...createAssetDto,
      };

      // Update your create method to actually call prisma.asset.create
      mockPrismaService.asset.create.mockResolvedValue(expectedResult);

      const result = await service.create(createAssetDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.asset.create).toHaveBeenCalledWith({
        data: createAssetDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of assets when assets are found', async () => {
      const assets = [
        {
          id: 1,
          ticker: 'AAPL',
          // ...other properties
        },
        {
          id: 2,
          ticker: 'GOOGL',
          // ...other properties
        },
      ];

      mockPrismaService.asset.findMany.mockResolvedValue(assets);

      const result = await service.findAll();

      expect(result).toEqual(assets);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });

    it('should return an array of assets with orderBy', async () => {
      const assets = [
        // ...assets data
      ];
      const orderBy = { field: 'price', direction: 'asc' as 'asc' | 'desc' };

      mockPrismaService.asset.findMany.mockResolvedValue(assets);

      const result = await service.findAll(orderBy);

      expect(result).toEqual(assets);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        orderBy: { [orderBy.field]: orderBy.direction },
      });
    });

    it('should throw NotFoundException when no assets are found', async () => {
      mockPrismaService.asset.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return an asset when found', async () => {
      const filter = { ticker: 'AAPL' };
      const asset = {
        id: 1,
        ticker: 'AAPL',
        // ...other properties
      };

      mockPrismaService.asset.findMany.mockResolvedValue([asset]);

      const result = await service.findOne(filter);

      expect(result).toEqual(asset);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        where: filter,
        orderBy: { date: 'desc' },
        take: 1,
      });
    });

    it('should throw NotFoundException when asset is not found', async () => {
      const filter = { ticker: 'NON_EXISTENT' };

      mockPrismaService.asset.findMany.mockResolvedValue([]);

      await expect(service.findOne(filter)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        where: filter,
        orderBy: { date: 'desc' },
        take: 1,
      });
    });
  });

  describe('update', () => {
    it('should update an asset when it exists', async () => {
      const id = 1;
      const updateAssetDto: UpdateAssetDto = {
        price: new Prisma.Decimal('155.00'),
      };
      const updatedAsset = {
        id,
        ticker: 'AAPL',
        price: new Prisma.Decimal('155.00'),
        // ...other properties
      };

      mockPrismaService.asset.update.mockResolvedValue(updatedAsset);

      const result = await service.update(id, updateAssetDto);

      expect(result).toEqual(updatedAsset);
      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: { id },
        data: updateAssetDto,
      });
    });

    it('should throw NotFoundException when asset does not exist', async () => {
      const id = 999;
      const updateAssetDto: UpdateAssetDto = {
        price: new Prisma.Decimal('155.00'),
      };

      const error = new Error();
      (error as any).code = 'P2025';

      mockPrismaService.asset.update.mockRejectedValue(error);

      await expect(service.update(id, updateAssetDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: { id },
        data: updateAssetDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove an asset when it exists', async () => {
      const id = 1;
      const deletedAsset = {
        id,
        ticker: 'AAPL',
        // ...other properties
      };

      mockPrismaService.asset.delete.mockResolvedValue(deletedAsset);

      const result = await service.remove(id);

      expect(result).toEqual(deletedAsset);
      expect(mockPrismaService.asset.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException when asset does not exist', async () => {
      const id = 999;

      const error = new Error();
      (error as any).code = 'P2025';

      mockPrismaService.asset.delete.mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.asset.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
