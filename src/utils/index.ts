import { v4 as uuidv4 } from 'uuid';

class Utils {
  static generateFileName(file: Express.Multer.File): string {
    const extension = this.getFileExtension(file);
    return `${uuidv4()}${extension}`;
  }
  static fileOriginalName(file: Express.Multer.File): string {
    return file.originalname;
  }
  static fileSize(file: Express.Multer.File): number {
    return file.size;
  }
  static fileReadableSize(file: Express.Multer.File): string {
    const bytes = file.size;

    // Conversion logic
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;

    let size = bytes;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }

    // Format to 2 decimal places
    return `${size.toFixed(2)} ${units[index]}`;
  }
  static getFileExtension(file: Express.Multer.File): string {
    const originalName = file.originalname;
    if (originalName && originalName.includes('.')) {
      return originalName
        .substring(originalName.lastIndexOf('.'))
        .toLowerCase();
    }
    const mimeTypeExtension = file.mimetype.split('/')[1];
    return mimeTypeExtension ? `.${mimeTypeExtension}` : '';
  }
  static getFileType(file: Express.Multer.File): string {
    const originalName = file.originalname;
    if (originalName && originalName.includes('.')) {
      // Remove the dot from the extension
      return originalName
        .substring(originalName.lastIndexOf('.') + 1)
        .toLowerCase();
    }
    const mimeTypeExtension = file.mimetype.split('/')[1];
    return mimeTypeExtension ? mimeTypeExtension : '';
  }  
}

export default Utils;
