import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Prisma } from '@prisma/client';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockTransactionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTransactionDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
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

      mockTransactionService.findAll.mockResolvedValue(transactions);

      const result = await controller.findAll();

      expect(result).toEqual(transactions);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single transaction', async () => {
      const id = '1';
      const transaction = {
        id: 1,
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1000.00'),
        walletId: 1,
      };

      mockTransactionService.findOne.mockResolvedValue(transaction);

      const result = await controller.findOne(id);

      expect(result).toEqual(transaction);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const id = '1';
      const updateTransactionDto: UpdateTransactionDto = {
        value: new Prisma.Decimal('1500.00'),
      };

      const updatedTransaction = {
        id: 1,
        date: new Date('2023-01-01'),
        value: new Prisma.Decimal('1500.00'),
        walletId: 1,
      };

      mockTransactionService.update.mockResolvedValue(updatedTransaction);

      const result = await controller.update(id, updateTransactionDto);

      expect(result).toEqual(updatedTransaction);
      expect(service.update).toHaveBeenCalledWith(+id, updateTransactionDto);
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const id = '1';
      const expectedResult = { message: `Transaction #${id} removed` };

      mockTransactionService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
