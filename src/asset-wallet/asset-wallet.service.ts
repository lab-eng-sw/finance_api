import { Injectable } from '@nestjs/common';
import { CreateAssetWalletDto } from './dto/create-asset-wallet.dto';
import { UpdateAssetWalletDto } from './dto/update-asset-wallet.dto';

@Injectable()
export class AssetWalletService {
  create(createAssetWalletDto: CreateAssetWalletDto) {
    return 'This action adds a new assetWallet';
  }

  findAll() {
    return `This action returns all assetWallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assetWallet`;
  }

  update(id: number, updateAssetWalletDto: UpdateAssetWalletDto) {
    return `This action updates a #${id} assetWallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} assetWallet`;
  }
}
