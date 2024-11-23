import {
  IsString,
  IsInt,
  IsOptional,
  IsNumberString,
  IsDateString,
} from 'class-validator';

export class CreateAssetDto {
  @IsString()
  ticker: string;

  @IsDateString()
  date: string;

  @IsNumberString()
  price: string;

  @IsInt()
  volume: number;

  @IsNumberString()
  dailyVariation: string;

  @IsNumberString()
  bbi: string;

  @IsOptional()
  @IsInt()
  rsi?: number;

  @IsOptional()
  @IsNumberString()
  scom?: string;

  @IsNumberString()
  sven: string;

  @IsString()
  assetName: string;

  @IsString()
  type: string;

  @IsString()
  benchmark: string;

  @IsNumberString()
  pl: string;

  @IsNumberString()
  macdim: string;

  @IsNumberString()
  macdis: string;

  @IsNumberString()
  macdh: string;

  @IsNumberString()
  bbs: string;

  @IsNumberString()
  bbl: string;

  @IsNumberString()
  bbm: string;

  @IsNumberString()
  rsicom: string;

  @IsNumberString()
  rsivem: string;
}
