import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as pdfThumbnail from 'pdf-thumbnail';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import pdfThumb from 'sharp-pdf';

@Injectable()
export class ThumbnailService {
  // Image Thumbnail Generation
  async generateImageThumbnail(
    filePath: string,
    outputPath: string,
  ): Promise<void> {
    await sharp(filePath).toFormat('jpg').resize(200, 200).toFile(outputPath);
  }

  // PDF Thumbnail Generation
  async generatePdfThumbnail(
    filePath: string,
    outputPath: string,
  ): Promise<void> {
    const images = await pdfThumb.sharpsFromPdf(filePath);
    const { image, name, channels } = images[0]; // First page thumbnail
    // const ext = channels > 3 ? '.png' : '.jpg';
    await image.toFile(outputPath);
  }

  // Video Thumbnail Generation
  async generateVideoThumbnail(
    filePath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .screenshots({
          count: 1,
          folder: path.dirname(outputPath),
          filename: path.basename(outputPath),
        })
        .on('end', () => resolve())
        .on('error', (err) =>
          reject('Error generating video thumbnail: ' + err),
        );
    });
  }

  // Main function to determine file type and generate thumbnail
  async generateThumbnail(filePath: string, outputPath: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
   
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.avif' || ext === '.gif') {
      await this.generateImageThumbnail(filePath, outputPath);
    } 
    // else if (ext === '.pdf') {
    //   await this.generatePdfThumbnail(filePath, outputPath);
    // } else if (ext === '.mp4' || ext === '.mkv' || ext === '.avi') {
    //   await this.generateVideoThumbnail(filePath, outputPath);
    // } else {
    //   throw new Error('Unsupported file type');
    // }
  }
}
