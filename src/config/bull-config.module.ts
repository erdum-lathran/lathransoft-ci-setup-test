import { BullModule } from '@nestjs/bull';
import { Global, Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullQueues } from 'src/enum';
import { EnvironmentConfigModule } from './environment-config.module';

@Global()
@Module({
  imports: [
    EnvironmentConfigModule,
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('BullQueueModule');

        const redisSocket = configService.get<string>('REDIS_SOCKET_PATH');
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');

        if (redisSocket) {
          // logger.log(`Connecting to Redis via socket path: ${redisSocket}`);
          return {
            redis: {
              socket: {
                path: redisSocket,
              },
            },
          };
        } else {
          // logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
          return {
            redis: {
              host: redisHost,
              port: redisPort,
              password: redisPassword || undefined,
            },
          };
        }
      },
    }),
    BullModule.registerQueue(
      { name: BullQueues.EMAIL_QUEUE },
      { name: BullQueues.FILE_UPLOAD_QUEUE },
      { name: BullQueues.FILE_PROCESS_QUEUE },
    ),
  ],
  exports: [BullModule],
})
export class BullQueueModule { }
