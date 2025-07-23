import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CloudService } from '../common/cloud.service';
import { Documents } from 'src/models/documents.modal';
import { DocumentFavorites } from 'src/models/documentFavorites.modal';
import { DocumentArchives } from 'src/models/documentArchives.modal';
import { DocumentShares } from 'src/models/documentShares.modal';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';
import { Users } from 'src/models/users.model';
import { UploadGateway } from './upload.gateway';
import { FileUploadProcessor } from './document.processor';
import { RedisCacheService } from '../common/cache.service';
import { CronJobService } from './document.job';
import { ScheduleModule } from '@nestjs/schedule';
// import { BullQueueModule } from 'src/config/bull-config.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // BullQueueModule,
    MailerModule,
    TypeOrmModule.forFeature([
      Users,
      Documents,
      DocumentFavorites,
      DocumentArchives,
      DocumentShares,
    ]),
  ],
  controllers: [DocumentController],
  providers: [
    CronJobService,  
    DocumentService,
    CloudService,
    MailerService,
    UploadGateway,
    RedisCacheService,
    FileUploadProcessor,
  ],
})
export class DocumentModule {}
