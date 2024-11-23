import { Test, TestingModule } from '@nestjs/testing';
import { InvestorService } from './investor.service';
import { PrismaService } from 'src/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Prisma, Investor } from '@prisma/client';

describe('InvestorService', () => {
  let service: InvestorService;
  let prisma: PrismaService;

  const mockPrismaService = {
    investor: {
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
        InvestorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InvestorService>(InvestorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findAll', () => {
    it('should return an array of investors', async () => {
      const investors: Investor[] = [
        {
          id: 1,
          email: 'test1@example.com',
          name: 'John Doe',
          password: 'hashedpassword1',
          tax_id: '123-45-6789',
        },
        {
          id: 2,
          email: 'test2@example.com',
          name: 'Jane Smith',
          password: 'hashedpassword2',
          tax_id: '987-65-4321',
        },
      ];

      mockPrismaService.investor.findMany.mockResolvedValue(investors);

      const result = await service.findAll();

      expect(result).toEqual(investors);
      expect(mockPrismaService.investor.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no investors are found', async () => {
      mockPrismaService.investor.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.investor.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an investor by ID', async () => {
      const investor: Investor = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        password: 'hashedpassword',
        tax_id: '123-45-6789',
      };

      mockPrismaService.investor.findUnique.mockResolvedValue(investor);

      const result = await service.findOne(1);

      expect(result).toEqual(investor);
      expect(mockPrismaService.investor.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if investor not found', async () => {
      mockPrismaService.investor.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.investor.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update an investor', async () => {
      const updateInvestorDto: UpdateInvestorDto = {
        name: 'John Updated',
      };

      const updatedInvestor: Investor = {
        id: 1,
        email: 'test@example.com',
        name: 'John Updated',
        password: 'hashedpassword',
        tax_id: '123-45-6789',
      };

      mockPrismaService.investor.update.mockResolvedValue(updatedInvestor);

      const result = await service.update(1, updateInvestorDto);

      expect(result).toEqual(updatedInvestor);
      expect(mockPrismaService.investor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateInvestorDto,
      });
    });

    it('should throw NotFoundException if investor to update is not found', async () => {
      mockPrismaService.investor.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.investor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });
  });

  describe('remove', () => {
    it('should remove an investor', async () => {
      const deletedInvestor: Investor = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        password: 'hashedpassword',
        tax_id: '123-45-6789',
      };

      mockPrismaService.investor.delete.mockResolvedValue(deletedInvestor);

      const result = await service.remove(1);

      expect(result).toEqual(deletedInvestor);
      expect(mockPrismaService.investor.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if investor to delete is not found', async () => {
      mockPrismaService.investor.delete.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.investor.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
