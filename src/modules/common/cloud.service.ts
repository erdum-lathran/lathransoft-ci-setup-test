import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as archiver from 'archiver';
import Utils from 'src/utils';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Messages } from 'src/utils/messages';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

@Injectable()
export class CloudService {
  private s3: S3;

  constructor(
    private readonly configService: ConfigService,
  ) {
    // Initialize S3 client
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'), // Add your AWS access key ID here
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'), // Add your AWS secret access key here
      region: this.configService.get('AWS_REGION' , 'ap-northeast-1'), // Specify the AWS region
      endpoint: this.configService.get('R2_ENDPOINT'),  // Add this endpoint config for R2
      s3ForcePathStyle: true, 
    });
  }

  // Method to upload file to S3 with optional multipart support
  async uploadFile(filePath: string, isPrivate = true, file: Express.Multer.File): Promise<string> {

    const folder = isPrivate ? this.configService.get('AWS_BUCKET_PRIVATE_FOLDER') : this.configService.get('AWS_BUCKET_PUBLIC_FOLDER');
    const fileContent = fs.createReadStream(filePath);  // Use stream to handle large files
    const fileName = await Utils.generateFileName(file);
    const fileKey = `${folder}/${fileName}`;

    // Check file size and use multipart upload if file is large
    const fileSize = fs.statSync(filePath).size;
    try {
      if (fileSize > 5 * 1024 * 1024) {  // 5MB limit for direct upload
        return this.uploadFileWithMultipart(fileContent, fileSize, fileKey);
      } else {
        const uploadResult = await this.s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME, // Replace with your S3 bucket name
            Key: fileKey,
            Body: fileContent,
            ACL: 'public-read',
          })
          .promise();
        return uploadResult.Key;  // Return the S3 file URL
      }
    } catch (error) {
      throw new HttpException(
        Messages.invalidKeyFileUpload,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // Method to upload a large file with multipart support
  private async uploadFileWithMultipart(fileContent: fs.ReadStream, fileSize: number, fileKey: string): Promise<string> {
    const multipartUploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME, // Replace with your S3 bucket name
      Key: fileKey,
      Body: fileContent,
      ContentType: 'application/octet-stream',  // Define content type as needed
      PartSize: 5 * 1024 * 1024,  // Use a part size of 5MB
      QueueSize: 10,  // Control concurrency, adjust as necessary
    };

    try {
      const uploadResult = await this.s3.upload(multipartUploadParams).promise();
      return uploadResult.Key;  // Return the S3 file URL
    } catch (error) {
      throw new Error('Failed to upload large file to S3');
    }
  }

  // Method to move file to a different folder in S3
  async moveFileToAnotherFolder(oldFileKey: string, newFileKey: string): Promise<string> {
    try {
      // Copy the file to the new location
      await this.s3
        .copyObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          CopySource: `${process.env.AWS_BUCKET_NAME}/${oldFileKey}`,
          Key: newFileKey,
        })
        .promise();

      // Delete the original file after copying it
      await this.s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldFileKey,
        })
        .promise();
      return `File moved from ${oldFileKey} to ${newFileKey}`;
    } catch (error) {
      console.error('S3 Move File Error:', error);
      throw new Error('Failed to move file in S3');
    }
  }

  async getFile(key: string): Promise<AWS.S3.GetObjectOutput> {

    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: 'private/3dfa827b-cdb9-4ad2-85f1-09d64ff85321.png' };
    return this.s3.getObject(params).promise();
  }
  async deleteFromR2(fileKey: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileKey,
        })
        .promise();
    } catch (error) {
      throw new Error('Failed to delete file from R2');
    }
  }

  async downloadFolderFiles(fileList: { key: string; path: string }[]): Promise<Readable> {
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      throw new Error(`Archiver error: ${err.message}`);
    });

    for (const file of fileList) {
    try {
      const fileStream = this.s3.getObject({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: file.key,
      }).createReadStream();
      archive.append(fileStream, { name: file.path });
      } catch (err) {
      throw new Error(`Failed to fetch file from R2: ${file.path}`);
      }
    }
    archive.finalize();
    return archive;
  }

}
