import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Get()
  findAll(
    @Query('field') field?: string,
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
  ) {
    const orderBy = field ? { field, direction } : undefined;
    return this.assetService.findAll(orderBy);
  }

  @Get('/find')
  findOne(@Query() filter: { [key: string]: any }) {
    return this.assetService.findOne(filter);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.remove(+id);
  }
}
