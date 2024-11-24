import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from 'src/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Prisma } from '@prisma/client';

describe('WalletService', () => {
  let service: WalletService;
  let prisma: PrismaService & {
    wallet: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    asset: {
      findFirst: jest.Mock;
    };
    assetWallet: {
      upsert: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    const prismaServiceMock = {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    prisma = module.get<PrismaService>(PrismaService) as any;
  });

  afterEach(() => {
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
      prisma.wallet.create.mockResolvedValue(expectedResult);

      const result = await service.create(createWalletDto);

      expect(result).toEqual(expectedResult);
      expect(prisma.wallet.create).toHaveBeenCalledWith({
        data: createWalletDto,
      });
    });

    it('should handle exceptions during wallet creation', async () => {
      const createWalletDto: CreateWalletDto = {
        totalInvested: 1000,
        active: false,
        investorId: 1,
      };

      const error = new Error('Database error');

      prisma.wallet.create.mockRejectedValue(error);

      await expect(service.create(createWalletDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prisma.wallet.create).toHaveBeenCalledWith({
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
      prisma.wallet.findMany.mockResolvedValue(wallets);

      const result = await service.findAll();

      expect(result).toEqual(wallets);
      expect(prisma.wallet.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no wallets are found', async () => {
      prisma.wallet.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(prisma.wallet.findMany).toHaveBeenCalled();
    });

    it('should handle exceptions during database access', async () => {
      prisma.wallet.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prisma.wallet.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a wallet by ID', async () => {
      const wallet = {
        id: 1,
        totalInvested: new Prisma.Decimal(1000),
        active: false,
        investorId: 1,
        assets: [
          {
            quantity: 10,
            asset: {
              id: 1,
              ticker: 'AAPL',
              price: new Prisma.Decimal(150),
            },
          },
          {
            quantity: 5,
            asset: {
              id: 2,
              ticker: 'GOOGL',
              price: new Prisma.Decimal(2000),
            },
          },
        ],
      };
      prisma.wallet.findUnique.mockResolvedValue(wallet);

      const result = await service.findOne(1);

      expect(result).toEqual(wallet);
      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          assets: {
            select: {
              id: true,
              quantity: true,
              boughtAt: true,
              asset: {
                select: {
                  id: true,
                  ticker: true,
                  price: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw NotFoundException if wallet not found', async () => {
      prisma.wallet.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          assets: {
            select: {
              id: true,
              quantity: true,
              boughtAt: true,
              asset: {
                select: {
                  id: true,
                  ticker: true,
                  price: true,
                },
              },
            },
          },
        },
      });
    });

    it('should handle exceptions during database access', async () => {
      prisma.wallet.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          assets: {
            select: {
              id: true,
              quantity: true,
              boughtAt: true,
              asset: {
                select: {
                  id: true,
                  ticker: true,
                  price: true,
                },
              },
            },
          },
        },
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

      const assetAAPL = {
        id: 1,
        ticker: 'AAPL',
        price: new Prisma.Decimal(150),
      };
      const assetGOOGL = {
        id: 2,
        ticker: 'GOOGL',
        price: new Prisma.Decimal(2000),
      };

      prisma.asset.findFirst
        .mockResolvedValueOnce(assetAAPL)
        .mockResolvedValueOnce(assetGOOGL);

      prisma.assetWallet.upsert.mockResolvedValue(null);

      const updatedWallet = {
        id: id,
        totalInvested: new Prisma.Decimal(11500), // 10 * 150 + 5 * 2000
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

      prisma.wallet.findUnique.mockResolvedValue(updatedWallet);

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      const result = await service.update(id, updateWalletDto);

      expect(result).toEqual(updatedWallet);

      expect(prisma.asset.findFirst).toHaveBeenCalledTimes(2);
      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { ticker: 'AAPL' },
      });
      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { ticker: 'GOOGL' },
      });

      expect(prisma.assetWallet.upsert).toHaveBeenCalledTimes(2);
      expect(prisma.assetWallet.upsert).toHaveBeenCalledWith({
        where: {
          assetId_walletId: {
            assetId: assetAAPL.id,
            walletId: id,
          },
        },
        update: {
          quantity: {
            increment: 10,
          },
        },
        create: {
          assetId: assetAAPL.id,
          walletId: id,
          quantity: 10,
          boughtAt: expect.any(Date),
        },
      });
      expect(prisma.assetWallet.upsert).toHaveBeenCalledWith({
        where: {
          assetId_walletId: {
            assetId: assetGOOGL.id,
            walletId: id,
          },
        },
        update: {
          quantity: {
            increment: 5,
          },
        },
        create: {
          assetId: assetGOOGL.id,
          walletId: id,
          quantity: 5,
          boughtAt: expect.any(Date),
        },
      });

      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          totalInvested: {
            increment: new Prisma.Decimal(11500),
          },
        },
      });

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          assets: true,
        },
      });
    });

    it('should throw error when asset quantity is negative', async () => {
      const id = 1;
      const updateWalletDto: UpdateWalletDto = {
        assets: [{ ticker: 'AAPL', quantity: -10 }],
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      await expect(service.update(id, updateWalletDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.asset.findFirst).not.toHaveBeenCalled();
      expect(prisma.assetWallet.upsert).not.toHaveBeenCalled();
    });

    it('should update wallet without assets', async () => {
      const id = 1;
      const updateWalletDto: UpdateWalletDto = {
        active: true,
      };

      const updatedWallet = {
        id: id,
        totalInvested: new Prisma.Decimal(1000),
        active: true,
        investorId: 1,
        assets: [],
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      prisma.wallet.update.mockResolvedValue(updatedWallet);
      prisma.wallet.findUnique.mockResolvedValue(updatedWallet);

      const result = await service.update(id, updateWalletDto);

      expect(result).toEqual(updatedWallet);

      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { id },
        data: updateWalletDto,
      });

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          assets: true,
        },
      });
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
      prisma.wallet.delete.mockResolvedValue(deletedWallet);

      const result = await service.remove(id);

      expect(result).toEqual(deletedWallet);
      expect(prisma.wallet.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should handle other exceptions during deletion', async () => {
      const id = 1;
      const error = new Error('Deletion error');

      prisma.wallet.delete.mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prisma.wallet.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
