import { UploadGateway } from './upload.gateway';
import { CloudService } from '../common/cloud.service';
import * as path from 'path';
import * as fs from 'fs/promises'; // 👈 fs.promises سے Async Methods استعمال کریں
import Utils from 'src/utils';
import { BullQueues, ItemType } from 'src/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from 'src/models/documents.modal';
import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('file-upload-queue')
export class FileUploadProcessor {
  constructor(
    @InjectRepository(Documents)
    private documentRepository: Repository<Documents>,
    private readonly cloudService: CloudService,
    private readonly uploadGateway: UploadGateway,
  ) { }

  // @Process('file-upload-queue')
  // async handleUpload(job: Job) {
  //   const path = require("path");
  //   console.log('Processing job:', job.id);
  //   const { fileDto, file, userId, tenantId } = job.data;
  //   const localFolderPath = path.join('uploads');
  //   await this.ensureFolderExists(localFolderPath);

  //   try {
  //     this.uploadGateway.sendProgressUpdate(job.id, 1);
  //     // const ext = path.extname(file.originalname);
  //     // const baseName = path.basename(file.originalname, ext);
  //     //const renamedFile = `${baseName}_${Date.now()}${ext}`;
  //     //const localFilePath = path.join(localFolderPath, renamedFile);

  //     //s3
  //     const localFilePath = path.join(localFolderPath, file.originalname);
  //     await this.saveFileLocally(file.buffer, localFilePath);

  //     this.uploadGateway.sendProgressUpdate(job.id, 10, true);

  //     // Add intermediate progress updates for the initial steps
  //     for (let i = 20; i <= 70; i += 10) {
  //       await new Promise((resolve) => setTimeout(resolve, 500));
  //       this.uploadGateway.sendProgressUpdate(job.id, i);
  //     }

  //     //Send continuous progress updates as the file is being uploaded to the cloud
  //     const fileUploadPromise = await this.cloudService.uploadFile(
  //       localFilePath,
  //       false,
  //       file,
  //     );

  //     // Periodically send progress updates between 70% and 90%
  //     for (let i = 70; i <= 90; i += 5) {
  //       await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async process
  //       this.uploadGateway.sendProgressUpdate(job.id, i);
  //     }

  //     //s3
  //     //const fileUrl = fileUploadPromise;
  //     const ext = path.extname(file.originalname);
  //     const baseName = path.basename(file.originalname, ext);

  //     const fileUrl = `${baseName}_${Date.now()}${ext}`;
  //     //const fileUrl = renamedFile

  //     this.uploadGateway.sendProgressUpdate(job.id, 95);

  //     // Uncomment if you want to delete the local file after upload
  //     //await this.removeLocalFile(localFilePath);

  //     const fileData = {
  //       tenantId,
  //       userId,
  //       name: Utils.fileOriginalName(file),
  //       key: fileUrl,
  //       isPrivate: true,
  //       format: Utils.getFileType(file),
  //       parentId: fileDto.parentId | 0,
  //       size: Utils.fileSize(file),
  //       readableSize: Utils.fileReadableSize(file),
  //       type: ItemType.FILE,
  //     };

  //     await this.documentRepository.save(fileData);

  //     this.uploadGateway.sendProgressUpdate(job.id, 100, true, 'Upload completed successfully.');

  //     return { success: true, url: fileUrl, data: fileData };
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     this.uploadGateway.sendProgressUpdate(job.id, 70, false, error.message);
  //     return { success: false, message: error.message };
  //     //need to throw exception
  //   }
  // }


  @OnQueueFailed()
  handleFailed(job: Job, error: Error) {
  }


  @Process({ name: 'file-process-queue', concurrency: 20 })
  async handleUpload(job: Job) {
    const path = require("path");
    const { fileDto, file, userId, tenantId } = job.data;
    const localFolderPath = path.join('uploads');
    await this.ensureFolderExists(localFolderPath);

    try {
      this.uploadGateway.sendProgressUpdate(job.id, 1);

      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const renamedFile = `${baseName}_${Date.now()}${ext}`;
      const localFilePath = path.join(localFolderPath, renamedFile);

      //s3
      //const localFilePath = path.join(localFolderPath, file.originalname);

      await this.saveFileLocally(file.buffer, localFilePath);

      this.uploadGateway.sendProgressUpdate(job.id, 10, true);

      // Add intermediate progress updates for the initial steps
      for (let i = 20; i <= 70; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.uploadGateway.sendProgressUpdate(job.id, i);
      }

      //Send continuous progress updates as the file is being uploaded to the cloud
      const fileUploadPromise = await this.cloudService.uploadFile(
        localFilePath,
        false,
        file,
      );

      // Periodically send progress updates between 70% and 90%
      for (let i = 70; i <= 90; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async process
        this.uploadGateway.sendProgressUpdate(job.id, i);
      }

      //s3
      //const fileUrl = fileUploadPromise;
      // const ext = path.extname(file.originalname);
      // const baseName = path.basename(file.originalname, ext);

      //const fileUrl = `${baseName}_${Date.now()}${ext}`;
      const fileUrl = fileUploadPromise;

      this.uploadGateway.sendProgressUpdate(job.id, 95);

      // Uncomment if you want to delete the local file after upload
      //await this.removeLocalFile(localFilePath);

      const fileData = {
        tenantId,
        userId,
        name: job.data.originalName,
        key: fileUrl,
        isPrivate: true,
        format: Utils.getFileType(file),
        parentId: fileDto.parentId | 0,
        size: Utils.fileSize(file),
        readableSize: Utils.fileReadableSize(file),
        type: ItemType.FILE,
      };

      await this.documentRepository.save(fileData);

      this.uploadGateway.sendProgressUpdate(job.id, 100, true, 'Upload completed successfully.');

      return { success: true, url: fileUrl, data: fileData };
    } catch (error) {
      this.uploadGateway.sendProgressUpdate(job.id, 70, false, error.message);
      throw error;
      //return { success: false, message: error.message };
      //need to throw exception
    }
  }


  // ✅ File Save کرنے کے لیے Safe Function
  private async saveFileLocally(buffer: any, filePath: string): Promise<void> {
    try {
      const fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer); // 👈 Ensure it's a Buffer
      await fs.writeFile(filePath, fileBuffer);
    } catch (error) {
      console.error(`Error saving file at ${filePath}:`, error);
      throw error;
    }
  }

  // ✅ Local File Delete Function
  private async removeLocalFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file at ${filePath}:`, error);
    }
  }

  // ✅ Ensure Folder Exists
  private async ensureFolderExists(folderPath: string): Promise<void> {
    try {
      await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating folder ${folderPath}:`, error);
    }
  }
}
