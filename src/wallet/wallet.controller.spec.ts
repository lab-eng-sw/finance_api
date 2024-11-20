import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
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
        totalInvested: 100,
        investorId: 1,
      };
      const result = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
        assets: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      await expect(controller.create(createWalletDto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createWalletDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of wallets', async () => {
      const result = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue([result]);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single wallet', async () => {
      const result = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
        assets: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should handle not found errors', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).resolves.toBeNull();
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a wallet', async () => {
      const result = {
        id: 1,
        totalInvested: new Prisma.Decimal(100),
        investorId: 1,
        active: true,
      };
      const updateWalletDto: UpdateWalletDto = {
        totalInvested: 100,
        investorId: 1,
      };

      await expect(controller.update('1', updateWalletDto)).resolves.toEqual(
        result,
      );
      expect(service.update).toHaveBeenCalledWith('1', updateWalletDto);
    });
  });

  describe('remove', () => {
    it('should remove a wallet', async () => {
      const result = { id: 1, name: 'Test Wallet' };

      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
