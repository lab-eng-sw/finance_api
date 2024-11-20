import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Prisma } from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    transactionRecord: {
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
        TransactionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1000.00'),
        walletId: 1,
      };

      const expectedResult = {
        id: 1,
        ...createTransactionDto,
      };

      mockPrismaService.transactionRecord.create.mockResolvedValue(
        expectedResult,
      );

      const result = await service.create(createTransactionDto);

      expect(result).toEqual(expectedResult);
      expect(prisma.transactionRecord.create).toHaveBeenCalledWith({
        data: createTransactionDto,
      });
    });

    it('should throw an error if creation fails', async () => {
      const createTransactionDto: CreateTransactionDto = {
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1000.00'),
        walletId: 1,
      };

      mockPrismaService.transactionRecord.create.mockRejectedValue(
        new Error('Creation Error'),
      );

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        'Creation Error',
      );
      expect(prisma.transactionRecord.create).toHaveBeenCalledWith({
        data: createTransactionDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = [
        {
          id: 1,
          date: new Date('2023-01-01'),
          value: new Prisma.Decimal('1000.00'),
          walletId: 1,
        },
        {
          id: 2,
          date: new Date('2023-01-02'),
          value: new Prisma.Decimal('500.00'),
          walletId: 2,
        },
      ];

      mockPrismaService.transactionRecord.findMany.mockResolvedValue(
        transactions,
      );

      const result = await service.findAll();

      expect(result).toEqual(transactions);
      expect(prisma.transactionRecord.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no transactions are found', async () => {
      mockPrismaService.transactionRecord.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(prisma.transactionRecord.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transaction by ID', async () => {
      const transaction = {
        id: 1,
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1000.00'),
        walletId: 1,
      };

      mockPrismaService.transactionRecord.findUnique.mockResolvedValue(
        transaction,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(transaction);
      expect(prisma.transactionRecord.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockPrismaService.transactionRecord.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(prisma.transactionRecord.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const updateTransactionDto: UpdateTransactionDto = {
        value: new Prisma.Decimal('1500.00'),
      };

      const updatedTransaction = {
        id: 1,
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1500.00'),
        walletId: 1,
      };

      mockPrismaService.transactionRecord.update.mockResolvedValue(
        updatedTransaction,
      );

      const result = await service.update(1, updateTransactionDto);

      expect(result).toEqual(updatedTransaction);
      expect(prisma.transactionRecord.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateTransactionDto,
      });
    });

    it('should throw NotFoundException if transaction to update is not found', async () => {
      mockPrismaService.transactionRecord.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(prisma.transactionRecord.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const deletedTransaction = {
        id: 1,
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1000.00'),
        walletId: 1,
      };

      mockPrismaService.transactionRecord.delete.mockResolvedValue(
        deletedTransaction,
      );

      const result = await service.remove(1);

      expect(result).toEqual(deletedTransaction);
      expect(prisma.transactionRecord.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if transaction to delete is not found', async () => {
      mockPrismaService.transactionRecord.delete.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(prisma.transactionRecord.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
