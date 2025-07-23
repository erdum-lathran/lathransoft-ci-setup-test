import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Ensures environment variables are globally available
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})

export class EnvironmentConfigModule {}
