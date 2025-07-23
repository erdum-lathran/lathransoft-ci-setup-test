import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnvironmentConfigModule } from './config/environment-config.module';
import { TypeOrmConfigModule } from './config/typeorm-config.module';
import { ExecutionTimeMiddleware } from './middleware/execution-time.middleware';
import { TrimMiddleware } from './middleware/trim.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentModule } from './modules/documents/document.module';
import { BullQueueModule } from './config/bull-config.module';
import { MailerModule } from './mailer/mailer.module';
import { GeneralModule } from './modules/general/general.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    BullQueueModule,
    TypeOrmConfigModule,
    GeneralModule,
    AuthModule,
    MailerModule,
    DocumentModule,
    SearchModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExecutionTimeMiddleware).forRoutes('*');
    consumer.apply(TrimMiddleware).forRoutes('*');
  }
}
