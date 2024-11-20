import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Prisma } from '@prisma/client';

describe('AssetController', () => {
  let controller: AssetController;
  let service: AssetService;

  const mockAssetService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
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
    service = module.get<AssetService>(AssetService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockAssetService.create.mockResolvedValue(expectedResult);

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
          rsi: 50,
          scom: new Prisma.Decimal('1.4'),
        },
        {
          id: 2,
          ticker: 'GOOGL',
          volume: 500,
          dailyVariation: new Prisma.Decimal('-0.03'),
          bbi: new Prisma.Decimal('1.1'),
          sven: new Prisma.Decimal('1.2'),
          assetName: 'Alphabet Inc.',
          type: 'Stock',
          benchmark: 'NASDAQ',
          date: new Date('2023-01-02'),
          price: new Prisma.Decimal('2800.00'),
          pl: new Prisma.Decimal('20.00'),
          macdim: new Prisma.Decimal('1.0'),
          macdis: new Prisma.Decimal('1.1'),
          macdh: new Prisma.Decimal('1.2'),
          bbs: new Prisma.Decimal('0.9'),
          bbl: new Prisma.Decimal('0.8'),
          bbm: new Prisma.Decimal('0.9'),
          rsicom: new Prisma.Decimal('40'),
          rsivem: new Prisma.Decimal('60'),
          rsi: 55,
          scom: new Prisma.Decimal('1.3'),
        },
      ];

      mockAssetService.findAll.mockResolvedValue(assets);

      const result = await controller.findAll();

      expect(result).toEqual(assets);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return an array of assets with orderBy', async () => {
      const assets = [
        {
          id: 1,
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
          rsi: 50,
          scom: new Prisma.Decimal('1.4'),
        },
        // ...other assets
      ];

      const field = 'price';
      const direction: 'asc' | 'desc' = 'asc';
      const orderBy = { field, direction };

      mockAssetService.findAll.mockResolvedValue(assets);

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
        rsi: 50,
        scom: new Prisma.Decimal('1.4'),
      };

      mockAssetService.findOne.mockResolvedValue(asset);

      const result = await controller.findOne(filter);

      expect(result).toEqual(asset);
      expect(service.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('update', () => {
    it('should update an asset', async () => {
      const id = '1';
      const updateAssetDto: UpdateAssetDto = {
        price: new Prisma.Decimal('155.00'),
        volume: 1100,
      };

      const updatedAsset = {
        id: 1,
        ticker: 'AAPL',
        volume: 1100,
        dailyVariation: new Prisma.Decimal('0.05'),
        bbi: new Prisma.Decimal('1.2'),
        sven: new Prisma.Decimal('1.5'),
        assetName: 'Apple Inc.',
        type: 'Stock',
        benchmark: 'NASDAQ',
        date: new Date('2023-01-01'),
        price: new Prisma.Decimal('155.00'),
        pl: new Prisma.Decimal('10.00'),
        macdim: new Prisma.Decimal('1.1'),
        macdis: new Prisma.Decimal('1.2'),
        macdh: new Prisma.Decimal('1.3'),
        bbs: new Prisma.Decimal('1.0'),
        bbl: new Prisma.Decimal('0.9'),
        bbm: new Prisma.Decimal('1.0'),
        rsicom: new Prisma.Decimal('30'),
        rsivem: new Prisma.Decimal('70'),
        rsi: 50,
        scom: new Prisma.Decimal('1.4'),
      };

      mockAssetService.update.mockResolvedValue(updatedAsset);

      const result = await controller.update(id, updateAssetDto);

      expect(result).toEqual(updatedAsset);
      expect(service.update).toHaveBeenCalledWith(+id, updateAssetDto);
    });
  });

  describe('remove', () => {
    it('should remove an asset', async () => {
      const id = '1';
      const expectedResult = { message: `Asset #${id} removed` };

      mockAssetService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
