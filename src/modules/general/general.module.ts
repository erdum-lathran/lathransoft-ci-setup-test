import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeneralController } from './general.controller';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [GeneralController],
})

export class GeneralModule {}
