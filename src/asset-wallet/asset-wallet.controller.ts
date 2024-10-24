import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetWalletService } from './asset-wallet.service';
import { CreateAssetWalletDto } from './dto/create-asset-wallet.dto';
import { UpdateAssetWalletDto } from './dto/update-asset-wallet.dto';

@Controller('asset-wallet')
export class AssetWalletController {
  constructor(private readonly assetWalletService: AssetWalletService) {}

  @Post()
  create(@Body() createAssetWalletDto: CreateAssetWalletDto) {
    return this.assetWalletService.create(createAssetWalletDto);
  }

  @Get()
  findAll() {
    return this.assetWalletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetWalletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetWalletDto: UpdateAssetWalletDto) {
    return this.assetWalletService.update(+id, updateAssetWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetWalletService.remove(+id);
  }
}
