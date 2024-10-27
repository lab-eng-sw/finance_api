import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InvestorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvestorDto: CreateInvestorDto) {
    return 'This action adds a new investor';
  }

  async findAll() {
    try {
      const investors = await this.prisma.investor.findMany();
      if (!investors.length) {
        throw new NotFoundException('No investors found');
      }
      return investors;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching investors');
    }
  }

  async findOne(id: number) {
    try {
      const investor = await this.prisma.investor.findUnique({
        where: { id },
      });
      if (!investor) {
        throw new NotFoundException(`Investor with ID ${id} not found`);
      }
      return investor;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching investor');
    }
  }

  async update(id: number, updateInvestorDto: UpdateInvestorDto) {
    try {
      const updatedInvestor = await this.prisma.investor.update({
        where: { id },
        data: updateInvestorDto,
      });
      return updatedInvestor;
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error code for record not found
        throw new NotFoundException(`Investor with ID ${id} not found`);
      }
      console.error(error);
      throw new InternalServerErrorException('Error updating investor');
    }
  }

  async remove(id: number) {
    try {
      const deletedInvestor = await this.prisma.investor.delete({
        where: { id },
      });
      return deletedInvestor;
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error code for record not found
        throw new NotFoundException(`Investor with ID ${id} not found`);
      }
      console.error(error);
      throw new InternalServerErrorException('Error removing investor');
    }
  }
}
