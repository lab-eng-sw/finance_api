// asset.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Prisma } from '@prisma/client';

describe('AssetController', () => {
  let controller: AssetController;
  let service: AssetService & {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  let mockAssetService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    mockAssetService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: AssetService,
          useValue: mockAssetService,
        },
      ],
    }).compile();

    controller = module.get<AssetController>(AssetController);
    service = module.get<AssetService>(AssetService) as AssetService & {
      create: jest.Mock;
      findAll: jest.Mock;
      findOne: jest.Mock;
      update: jest.Mock;
      remove: jest.Mock;
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new asset', async () => {
      const createAssetDto: CreateAssetDto = {
        ticker: 'AAPL',
        date: '2023-01-01T00:00:00Z',
        price: '150.00', 
        volume: 1000,
        dailyVariation: '0.05',
        bbi: '1.2',
        rsi: 50,
        scom: '1.4',
        sven: '1.5',
        assetName: 'Apple Inc.',
        type: 'Stock',
        benchmark: 'NASDAQ',
        pl: '10.00',
        macdim: '1.1',
        macdis: '1.2',
        macdh: '1.3',
        bbs: '1.0',
        bbl: '0.9',
        bbm: '1.0',
        rsicom: '30',
        rsivem: '70',
      };

      const expectedResult = {
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

      service.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createAssetDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createAssetDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of assets without orderBy', async () => {
      const assets = [
        {
          id: 1,
          ticker: 'AAPL',
          date: new Date('2023-01-01T00:00:00Z'),
          price: new Prisma.Decimal('150.00'),
        },
        {
          id: 2,
          ticker: 'GOOGL',
          date: new Date('2023-01-02T00:00:00Z'),
          price: new Prisma.Decimal('2800.00'),
        },
      ];

      service.findAll.mockResolvedValue(assets);

      const result = await controller.findAll();

      expect(result).toEqual(assets);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return an array of assets with A', async () => {
      const assets = [
        // ... assets data
      ];

      const field = 'price';
      const direction: 'asc' | 'desc' = 'asc';
      const orderBy = { field, direction };

      service.findAll.mockResolvedValue(assets);

      const result = await controller.findAll(field, direction);

      expect(result).toEqual(assets);
      expect(service.findAll).toHaveBeenCalledWith(orderBy);
    });
  });

  describe('findOne', () => {
    it('should return a single asset based on filter', async () => {
      const filter = { ticker: 'AAPL' };
      const asset = {
        id: 1,
        ticker: 'AAPL',
        date: new Date('2023-01-01T00:00:00Z'),
        price: new Prisma.Decimal('150.00'),
        // ... other properties
      };

      service.findOne.mockResolvedValue(asset);

      const result = await controller.findOne(filter);

      expect(result).toEqual(asset);
      expect(service.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('update', () => {
    it('should update an asset', async () => {
      const id = '1';
      const updateAssetDto: UpdateAssetDto = {
        price: '155.00',
        volume: 1100,
      };

      const updatedAsset = {
        id: 1,
        ticker: 'AAPL',
        date: new Date('2023-01-01T00:00:00Z'),
        price: new Prisma.Decimal('155.00'),
        volume: 1100,
        // ... other properties
      };

      service.update.mockResolvedValue(updatedAsset);

      const result = await controller.update(id, updateAssetDto);

      expect(result).toEqual(updatedAsset);
      expect(service.update).toHaveBeenCalledWith(+id, updateAssetDto);
    });
  });

  describe('remove', () => {
    it('should remove an asset', async () => {
      const id = '1';
      const deletedAsset = {
        id: 1,
        ticker: 'AAPL',
        // ... other properties
      };

      service.remove.mockResolvedValue(deletedAsset);

      const result = await controller.remove(id);

      expect(result).toEqual(deletedAsset);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
