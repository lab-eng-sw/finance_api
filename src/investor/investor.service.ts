import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvestorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvestorDto: CreateInvestorDto) {
    try {
      const investor = await this.prisma.investor.create({
        data: createInvestorDto,
      });
      return investor;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email or Tax ID already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const investors = await this.prisma.investor.findMany();
    if (!investors.length) {
      throw new NotFoundException('No investors found');
    }
    return investors;
  }

  async findOne(id: number) {
    const investor = await this.prisma.investor.findUnique({
      where: { id },
    });
    if (!investor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }
    return investor;
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
        throw new NotFoundException(`Investor with ID ${id} not found`);
      }
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
        throw new NotFoundException(`Investor with ID ${id} not found`);
      }
    }
  }
}
