import { Test, TestingModule } from '@nestjs/testing';
import { AssetWalletController } from './asset-wallet.controller';
import { AssetWalletService } from './asset-wallet.service';

describe('AssetWalletController', () => {
  let controller: AssetWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetWalletController],
      providers: [AssetWalletService],
    }).compile();

    controller = module.get<AssetWalletController>(AssetWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
