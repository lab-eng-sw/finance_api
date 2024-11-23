// wallet.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a wallet', async () => {
      const createWalletDto: CreateWalletDto = {
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
      };

      const serviceResult = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
        assets: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(serviceResult);

      await expect(controller.create(createWalletDto)).resolves.toEqual(
        serviceResult,
      );
      expect(service.create).toHaveBeenCalledWith(createWalletDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of wallets', async () => {
      const serviceResult = [
        {
          id: 1,
          totalInvested: new Prisma.Decimal(100),
          investorId: 1,
          active: true,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(serviceResult);

      await expect(controller.findAll()).resolves.toEqual(serviceResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single wallet', async () => {
      const serviceResult = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
        assets: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(serviceResult);

      await expect(controller.findOne('1')).resolves.toEqual(serviceResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if wallet not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Wallet not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a wallet', async () => {
      const serviceResult = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
        assets: [],
      };

      jest.spyOn(service, 'remove').mockResolvedValue(serviceResult);

      await expect(controller.remove('1')).resolves.toEqual(serviceResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
