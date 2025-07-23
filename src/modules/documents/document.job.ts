import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from 'src/models/documents.modal';
import { Repository } from 'typeorm';

@Injectable()
export class CronJobService {
  constructor(
    @InjectRepository(Documents)
    private documentRepository: Repository<Documents>,
  ) {}

  // @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  // async handleCron() {
  //   console.log('Delete Document Cron job is running...');
  //   try {
  //     const result = await this.documentRepository.delete({
  //       isDeleted: true,
  //     });
  //   } catch (error) {
  //     console.log('Error in Cron Job', error);
  //   }
  // }
}
