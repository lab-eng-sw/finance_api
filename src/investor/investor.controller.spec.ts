import { Test, TestingModule } from '@nestjs/testing';
import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

describe('InvestorController', () => {
  let controller: InvestorController;
  let service: InvestorService;

  const mockInvestorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorController],
      providers: [
        {
          provide: InvestorService,
          useValue: mockInvestorService,
        },
      ],
    }).compile();

    controller = module.get<InvestorController>(InvestorController);
    service = module.get<InvestorService>(InvestorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new investor', async () => {
      const createInvestorDto: CreateInvestorDto = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'securepassword',
        tax_id: '123-45-6789',
      };

      const expectedResult = {
        id: 1,
        ...createInvestorDto,
      };

      mockInvestorService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createInvestorDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createInvestorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of investors', async () => {
      const investors = [
        {
          id: 1,
          email: 'test1@example.com',
          name: 'John Doe',
          password: 'hashedpassword1',
          tax_id: '123-45-6789',
        },
        {
          id: 2,
          email: 'test2@example.com',
          name: 'Jane Smith',
          password: 'hashedpassword2',
          tax_id: '987-65-4321',
        },
      ];

      mockInvestorService.findAll.mockResolvedValue(investors);

      const result = await controller.findAll();

      expect(result).toEqual(investors);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single investor', async () => {
      const id = '1';
      const investor = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        password: 'hashedpassword',
        tax_id: '123-45-6789',
      };

      mockInvestorService.findOne.mockResolvedValue(investor);

      const result = await controller.findOne(id);

      expect(result).toEqual(investor);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update an investor', async () => {
      const id = '1';
      const updateInvestorDto: UpdateInvestorDto = {
        name: 'John Updated',
      };

      const updatedInvestor = {
        id: 1,
        email: 'test@example.com',
        name: 'John Updated',
        password: 'hashedpassword',
        tax_id: '123-45-6789',
      };

      mockInvestorService.update.mockResolvedValue(updatedInvestor);

      const result = await controller.update(id, updateInvestorDto);

      expect(result).toEqual(updatedInvestor);
      expect(service.update).toHaveBeenCalledWith(+id, updateInvestorDto);
    });
  });

  describe('remove', () => {
    it('should remove an investor', async () => {
      const id = '1';
      const expectedResult = { message: `Investor #${id} removed` };

      mockInvestorService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
