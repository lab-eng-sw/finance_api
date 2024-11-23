// update-wallet.dto.ts
import { IsArray, ValidateNested, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateAssetDto {
  @IsString()
  ticker: string;

  @IsInt()
  quantity: number;
}

export class UpdateWalletDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAssetDto)
  assets: UpdateAssetDto[];
}
