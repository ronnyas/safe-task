import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import Safe, {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
} from '@safe-global/protocol-kit';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SafeService {
  private provider: ethers.JsonRpcProvider;
  private logger = new Logger(SafeService.name);

  constructor(private configService: ConfigService) {
    const RPC_URL = this.configService.get<string>('RPC_URL');
    if (!RPC_URL) {
      throw new Error('No RPC URL found in environment variables');
    }
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
  }

  private validAddresses(addresses: string[]): boolean {
    const invalidAddresses = addresses.filter(
      (address) => !ethers.isAddress(address),
    );
    if (invalidAddresses.length > 0) {
      throw new Error(
        `The following addresses are not valid: ${invalidAddresses.join(', ')}`,
      );
    }

    return true;
  }

  private getSigner(): ethers.Wallet {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('No private key found in environment variables');
    }

    const signer = new ethers.Wallet(privateKey, this.provider);

    return signer;
  }

  private getEthAdapter(signer: ethers.Wallet): EthersAdapter {
    const adapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    return adapter;
  }

  private async prepareSafeFactory(
    adapter: EthersAdapter,
  ): Promise<SafeFactory> {
    const safeFactory = await SafeFactory.create({
      ethAdapter: adapter,
    });

    return safeFactory;
  }

  async createSafe(owners: string[], threshold = 1): Promise<string> {
    this.validAddresses(owners);

    this.logger.debug(
      `Creating Safe with owners JSON: ${JSON.stringify(owners)}, with threshold: ${threshold}`,
    );

    const signer = this.getSigner();
    const ethAdapter = this.getEthAdapter(signer);

    const safeFactory = await this.prepareSafeFactory(ethAdapter);

    const safeAccountConfig: SafeAccountConfig = {
      owners: owners,
      threshold: threshold,
    };

    const deployment: Safe = await safeFactory.deploySafe({
      safeAccountConfig,
    });

    const safeAddress = await deployment.getAddress();
    this.logger.debug(`Safe Address: ${safeAddress}`);

    return safeAddress;
  }
}
