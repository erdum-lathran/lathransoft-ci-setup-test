// email.module.ts
import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailProcessor } from './mailer.processor';

@Module({
  providers: [MailerService, EmailProcessor],
  exports: [MailerService],
})
export class MailerModule {}
