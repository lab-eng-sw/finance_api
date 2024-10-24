import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetWalletDto } from './create-asset-wallet.dto';

export class UpdateAssetWalletDto extends PartialType(CreateAssetWalletDto) {}
