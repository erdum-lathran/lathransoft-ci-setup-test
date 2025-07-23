import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { BullQueues } from 'src/enum';
import { generateEmailTemplate } from 'src/templates';
import { EmailSubjects } from 'src/utils/messages';
@Injectable()
export class MailerService {
  constructor(@InjectQueue(BullQueues.EMAIL_QUEUE) private emailQueue: Queue) { }

  private queSettings = {
    attempts: 5,
    delay: 10000,
    removeOnComplete: true,
  };

  async shareDocumentEmail(payload: any[]) {
    const emailJobs = payload.map(async (ele) => {
      const subject = EmailSubjects.shareDocument;
      const message = `Hi <b>${ele?.sender}</b>,<br><b>
        ${ele?.receiver}
        </b> has shared a file with you: <b>${ele.documentName}</b>.<br>You can access it using the link below:`;
      const html = generateEmailTemplate({
        title: subject,
        message,
        buttonText: 'View File',
        buttonLink: ele.link,
      });
      const temp = { html, subject, email: ele.email };

      return await this.emailQueue.add(BullQueues.EMAIL_QUEUE, temp, this.queSettings);

    });
    await Promise.all(emailJobs);
  }
}
