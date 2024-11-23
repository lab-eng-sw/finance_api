import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Prisma } from '@prisma/client';

describe('WalletService', () => {
  let service: WalletService;
  let prisma: PrismaService;

  const mockPrismaService = {
    wallet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    asset: {
      findFirst: jest.fn(),
    },
    assetWallet: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new wallet', async () => {
      const createWalletDto: CreateWalletDto = {
        totalInvested: 1000,
        active: false,
        investorId: 1,
      };
      const expectedResult = {
        id: 1,
        ...createWalletDto,
      };
      mockPrismaService.wallet.create.mockResolvedValue(expectedResult);

      const result = await service.create(createWalletDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.wallet.create).toHaveBeenCalledWith({
        data: createWalletDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of wallets', async () => {
      const wallets = [
        {
          id: 1,
          totalInvested: new Prisma.Decimal(1000),
          active: false,
          investorId: 1,
        },
        {
          id: 2,
          totalInvested: new Prisma.Decimal(2000),
          active: true,
          investorId: 2,
        },
      ];
      mockPrismaService.wallet.findMany.mockResolvedValue(wallets);

      const result = await service.findAll();

      expect(result).toEqual(wallets);
      expect(mockPrismaService.wallet.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no wallets are found', async () => {
      mockPrismaService.wallet.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.wallet.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a wallet by ID', async () => {
      const wallet = {
        id: 1,
        totalInvested: new Prisma.Decimal(1000),
        active: false,
        investorId: 1,
        assets: [],
      };
      mockPrismaService.wallet.findUnique.mockResolvedValue(wallet);

      const result = await service.findOne(1);

      expect(result).toEqual(wallet);
      expect(mockPrismaService.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { assets: true },
      });
    });

    it('should throw NotFoundException if wallet not found', async () => {
      mockPrismaService.wallet.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { assets: true },
      });
    });
  });

  describe('update', () => {
    it('should update the wallet assets and return the updated wallet', async () => {
      const id = 1;
      const updateWalletDto: UpdateWalletDto = {
        assets: [
          { ticker: 'AAPL', quantity: 10 },
          { ticker: 'GOOGL', quantity: 5 },
        ],
      };

      const assetAAPL = { id: 1, ticker: 'AAPL' };
      const assetGOOGL = { id: 2, ticker: 'GOOGL' };

   
      mockPrismaService.asset.findFirst
        .mockResolvedValueOnce(assetAAPL)
        .mockResolvedValueOnce(assetGOOGL);

  
      mockPrismaService.assetWallet.upsert.mockResolvedValue(null);


      const updatedWallet = {
        id: id,
        totalInvested: new Prisma.Decimal(1000),
        active: true,
        investorId: 1,
        assets: [
          {
            quantity: 10,
            asset: assetAAPL,
          },
          {
            quantity: 5,
            asset: assetGOOGL,
          },
        ],
      };
      mockPrismaService.wallet.findUnique.mockResolvedValue(updatedWallet);

  
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });

      const result = await service.update(id, updateWalletDto);

      expect(result).toEqual(updatedWallet);


      expect(mockPrismaService.asset.findFirst).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.asset.findFirst).toHaveBeenCalledWith({ where: { ticker: 'AAPL' } });
      expect(mockPrismaService.asset.findFirst).toHaveBeenCalledWith({ where: { ticker: 'GOOGL' } });


      expect(mockPrismaService.assetWallet.upsert).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.assetWallet.upsert).toHaveBeenCalledWith({
        where: {
          assetId_walletId: {
            assetId: assetAAPL.id,
            walletId: id,
          },
        },
        update: {
          quantity: 10,
        },
        create: {
          assetId: assetAAPL.id,
          walletId: id,
          quantity: 10,
          boughtAt: expect.any(Date),
        },
      });
      expect(mockPrismaService.assetWallet.upsert).toHaveBeenCalledWith({
        where: {
          assetId_walletId: {
            assetId: assetGOOGL.id,
            walletId: id,
          },
        },
        update: {
          quantity: 5,
        },
        create: {
          assetId: assetGOOGL.id,
          walletId: id,
          quantity: 5,
          boughtAt: expect.any(Date),
        },
      });

      expect(mockPrismaService.wallet.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          assets: {
            include: {
              asset: true,
            },
          },
        },
      });
    });

    it('should throw an error if an asset is not found', async () => {
      const id = 1;
      const updateWalletDto: UpdateWalletDto = {
        assets: [{ ticker: 'INVALID', quantity: 10 }],
      };

      mockPrismaService.asset.findFirst.mockResolvedValue(null);

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });

      await expect(service.update(id, updateWalletDto)).rejects.toThrowError(
        `Asset with ticker INVALID not found`,
      );

      expect(mockPrismaService.asset.findFirst).toHaveBeenCalledWith({ where: { ticker: 'INVALID' } });
      expect(mockPrismaService.assetWallet.upsert).not.toHaveBeenCalled();
      expect(mockPrismaService.wallet.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove the wallet by ID', async () => {
      const id = 1;
      const deletedWallet = {
        id,
        totalInvested: new Prisma.Decimal(1000),
        active: false,
        investorId: 1,
      };
      mockPrismaService.wallet.delete.mockResolvedValue(deletedWallet);

      const result = await service.remove(id);

      expect(result).toEqual(deletedWallet);
      expect(mockPrismaService.wallet.delete).toHaveBeenCalledWith({ where: { id } });
    });

   
  });
});
