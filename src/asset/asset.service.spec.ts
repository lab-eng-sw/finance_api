// asset.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Prisma } from '@prisma/client';

describe('AssetService', () => {
  let service: AssetService;
  let prisma: PrismaService & {
    asset: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const prismaAssetMock = {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: PrismaService,
          useValue: {
            asset: prismaAssetMock,
          },
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    prisma = module.get<PrismaService>(PrismaService) as typeof prisma & {
      asset: typeof prismaAssetMock;
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new asset', async () => {
      const createAssetDto: CreateAssetDto = {
        ticker: 'AAPL',
        date: '2023-10-24T00:00:00Z',
        price: '150.25',
        volume: 1000000,
        dailyVariation: '1.5',
        bbi: '2.3',
        rsi: 70,
        scom: '1.1',
        sven: '2.0',
        assetName: 'Apple Inc.',
        type: 'Stock',
        benchmark: 'NASDAQ',
        pl: '15.0',
        macdim: '0.5',
        macdis: '0.4',
        macdh: '0.1',
        bbs: '3.0',
        bbl: '2.5',
        bbm: '2.75',
        rsicom: '1.8',
        rsivem: '1.7',
      };

      const expectedAsset = {
        id: 1,
        ...createAssetDto,
        date: new Date(createAssetDto.date),
        price: new Prisma.Decimal(createAssetDto.price),
        dailyVariation: new Prisma.Decimal(createAssetDto.dailyVariation),
        bbi: new Prisma.Decimal(createAssetDto.bbi),
        scom: new Prisma.Decimal(createAssetDto.scom),
        sven: new Prisma.Decimal(createAssetDto.sven),
        pl: new Prisma.Decimal(createAssetDto.pl),
        macdim: new Prisma.Decimal(createAssetDto.macdim),
        macdis: new Prisma.Decimal(createAssetDto.macdis),
        macdh: new Prisma.Decimal(createAssetDto.macdh),
        bbs: new Prisma.Decimal(createAssetDto.bbs),
        bbl: new Prisma.Decimal(createAssetDto.bbl),
        bbm: new Prisma.Decimal(createAssetDto.bbm),
        rsicom: new Prisma.Decimal(createAssetDto.rsicom),
        rsivem: new Prisma.Decimal(createAssetDto.rsivem),
      };

      prisma.asset.create.mockResolvedValue(expectedAsset);

      const result = await service.create(createAssetDto);

      expect(result).toEqual(expectedAsset);
      expect(prisma.asset.create).toHaveBeenCalledWith({
        data: {
          ticker: createAssetDto.ticker,
          date: new Date(createAssetDto.date),
          price: new Prisma.Decimal(createAssetDto.price),
          volume: createAssetDto.volume,
          dailyVariation: new Prisma.Decimal(createAssetDto.dailyVariation),
          bbi: new Prisma.Decimal(createAssetDto.bbi),
          rsi: createAssetDto.rsi,
          scom: new Prisma.Decimal(createAssetDto.scom),
          sven: new Prisma.Decimal(createAssetDto.sven),
          assetName: createAssetDto.assetName,
          type: createAssetDto.type,
          benchmark: createAssetDto.benchmark,
          pl: new Prisma.Decimal(createAssetDto.pl),
          macdim: new Prisma.Decimal(createAssetDto.macdim),
          macdis: new Prisma.Decimal(createAssetDto.macdis),
          macdh: new Prisma.Decimal(createAssetDto.macdh),
          bbs: new Prisma.Decimal(createAssetDto.bbs),
          bbl: new Prisma.Decimal(createAssetDto.bbl),
          bbm: new Prisma.Decimal(createAssetDto.bbm),
          rsicom: new Prisma.Decimal(createAssetDto.rsicom),
          rsivem: new Prisma.Decimal(createAssetDto.rsivem),
        },
      });
    });

    it('should handle other exceptions during asset creation', async () => {
      const createAssetDto: CreateAssetDto = {
        ticker: 'AAPL',
        date: 'invalid-date',
        price: '150.25',
        volume: 1000000,
        dailyVariation: '1.5',
        bbi: '2.3',
        rsi: 70,
        scom: '1.1',
        sven: '2.0',
        assetName: 'Apple Inc.',
        type: 'Stock',
        benchmark: 'NASDAQ',
        pl: '15.0',
        macdim: '0.5',
        macdis: '0.4',
        macdh: '0.1',
        bbs: '3.0',
        bbl: '2.5',
        bbm: '2.75',
        rsicom: '1.8',
        rsivem: '1.7',
      };

      const error = new Error('Invalid date format');

      prisma.asset.create.mockRejectedValue(error);

      await expect(service.create(createAssetDto)).rejects.toThrow(BadRequestException);
      expect(prisma.asset.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of assets when assets are found', async () => {
      const assets = [
        {
          id: 1,
          ticker: 'AAPL',
        },
        {
          id: 2,
          ticker: 'GOOGL',
        },
      ];

      prisma.asset.findMany.mockResolvedValue(assets);

      const result = await service.findAll();

      expect(result).toEqual(assets);
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });

    it('should return an array of assets with orderBy', async () => {
      const assets = [
        {
          id: 1,
          ticker: 'AAPL',
        },
        {
          id: 2,
          ticker: 'GOOGL',
        },
      ];
      const orderBy = { field: 'price', direction: 'asc' as 'asc' | 'desc' };

      prisma.asset.findMany.mockResolvedValue(assets);

      const result = await service.findAll(orderBy);

      expect(result).toEqual(assets);
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        orderBy: { [orderBy.field]: orderBy.direction },
      });
    });

    it('should throw NotFoundException when no assets are found', async () => {
      prisma.asset.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return an asset when it exists', async () => {
      const filter = { ticker: 'AAPL' };
      const asset = [
        {
          id: 1,
          ticker: 'AAPL',
        },
      ];

      prisma.asset.findMany.mockResolvedValue(asset);

      const result = await service.findOne(filter);

      expect(result).toEqual(asset);
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
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
        price: '155.00',
        volume: 1100000,
      };

      const updatedAsset = {
        id,
        ticker: 'AAPL',
        price: new Prisma.Decimal(updateAssetDto.price),
        volume: updateAssetDto.volume,
      };

      prisma.asset.update.mockResolvedValue(updatedAsset);

      const result = await service.update(id, updateAssetDto);

      expect(result).toEqual(updatedAsset);
      expect(prisma.asset.update).toHaveBeenCalledWith({
        where: { id },
        data: updateAssetDto,
      });
    });

    it('should throw NotFoundException when asset does not exist', async () => {
      const id = 999;
      const updateAssetDto: UpdateAssetDto = {
        price: '155.00',
        volume: 1100000,
      };

      const prismaError = {
        code: 'P2025',
        message: 'Record not found',
      };

      prisma.asset.update.mockRejectedValue(prismaError);

      await expect(service.update(id, updateAssetDto)).rejects.toThrow(NotFoundException);
      expect(prisma.asset.update).toHaveBeenCalledWith({
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
      };

      prisma.asset.delete.mockResolvedValue(deletedAsset);

      const result = await service.remove(id);

      expect(result).toEqual(deletedAsset);
      expect(prisma.asset.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException when asset does not exist', async () => {
      const id = 999;

      const prismaError = {
        code: 'P2025',
        message: 'Record not found',
      };

      prisma.asset.delete.mockRejectedValue(prismaError);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(prisma.asset.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
