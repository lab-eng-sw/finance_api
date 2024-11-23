// update-order.dto.ts

import { IsOptional, IsString, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class AssetOrderDto {
  @IsString()
  ticker: string;

  @IsInt()
  quantity: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetOrderDto)
  assets?: AssetOrderDto[];
}
