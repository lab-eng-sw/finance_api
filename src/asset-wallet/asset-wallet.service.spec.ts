import { Test, TestingModule } from '@nestjs/testing';
import { AssetWalletService } from './asset-wallet.service';

describe('AssetWalletService', () => {
  let service: AssetWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetWalletService],
    }).compile();

    service = module.get<AssetWalletService>(AssetWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
