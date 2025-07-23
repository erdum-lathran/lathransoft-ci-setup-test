import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { BullQueues } from 'src/enum';
import * as nodemailer from 'nodemailer';
@Processor(BullQueues.EMAIL_QUEUE)
export class EmailProcessor {
  private transporter: nodemailer.Transporter;
  constructor() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT, 10) || 587, // Fallback to 587 if undefined
      secure: parseInt(EMAIL_PORT, 10) === 465, // Secure only if port is 465
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
  }
  @Process(BullQueues.EMAIL_QUEUE)
  async handleEmailJob(job: Job) {

    const info = await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: job.data.email,
      subject: job.data.subject,
      html: job.data.html,
    });

  }
}
