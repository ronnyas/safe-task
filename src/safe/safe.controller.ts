import { Controller, Logger, Post, Body } from '@nestjs/common';
import { SafeService } from './safe.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('safe')
export class SafeController {
  private readonly logger = new Logger(SafeController.name);

  constructor(private readonly safeService: SafeService) {
    this.logger.log('Gnosis Safe Controller Initialized');
  }

  @Post('deploy')
  async deploySafe(
    @Body() body: { owners: string[]; threshold: number | undefined },
  ) {
    const owners = body.owners;
    const threshold = body.threshold;
    if (!owners || owners.length === 0) {
      throw new HttpException(
        'At least one owner address is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const safe = await this.safeService.createSafe(owners, threshold);

      return {
        message: 'Safe deployed successfully',
        data: {
          address: safe,
        },
      };
    } catch (error) {
      // demo-shortcut; not ideal to log internal error details to the client
      throw new HttpException(
        `Error deploying Safe: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
