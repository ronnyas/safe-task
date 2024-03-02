import { Test, TestingModule } from '@nestjs/testing';
import { SafeController } from './safe.controller';
import { SafeService } from './safe.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SafeController', () => {
  let controller: SafeController;
  let service: SafeService;

  beforeEach(async () => {
    const mockSafeService = {
      createSafe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafeController],
      providers: [{ provide: SafeService, useValue: mockSafeService }],
    }).compile();

    controller = module.get<SafeController>(SafeController);
    service = module.get<SafeService>(SafeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an error if no owners are provided', async () => {
    await expect(
      controller.deploySafe({ owners: [], threshold: 1 }),
    ).rejects.toThrow(
      new HttpException(
        'At least one owner address is required',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return safe address if safe is deployed successfully', async () => {
    const owners = ['foo', 'bar'];
    const threshold = 1;
    const safeAddress = '0x...';

    jest.spyOn(service, 'createSafe').mockResolvedValueOnce(safeAddress);

    await expect(controller.deploySafe({ owners, threshold })).resolves.toEqual(
      {
        message: 'Safe deployed successfully',
        data: {
          address: safeAddress,
        },
      },
    );
  });

  it('should throw an error if safe deployment fails', async () => {
    const owners = ['foo', 'bar'];
    const threshold = 1;
    const errorMessage = 'Error deploying Safe';

    jest
      .spyOn(service, 'createSafe')
      .mockRejectedValueOnce(new Error(errorMessage));

    await expect(controller.deploySafe({ owners, threshold })).rejects.toThrow(
      new HttpException(
        `Error deploying Safe: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
