import { Module } from '@nestjs/common';
import { SafeController } from './safe/safe.controller';
import { SafeService } from './safe/safe.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SafeController],
  providers: [SafeService],
})
export class AppModule {}
