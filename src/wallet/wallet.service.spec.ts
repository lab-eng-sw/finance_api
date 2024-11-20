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
    it('should return a string confirming the update', () => {
      const id = 1;
      const updateWalletDto: UpdateWalletDto = {
        totalInvested:1500,
        active: true,
      };
      const result = service.update(id, updateWalletDto);
      expect(result).toBe(`This action updates a #${id} wallet`);
    });
  });

  describe('remove', () => {
    it('should return a string confirming the removal', () => {
      const id = 1;
      const result = service.remove(id);
      expect(result).toBe(`This action removes a #${id} wallet`);
    });
  });
});
