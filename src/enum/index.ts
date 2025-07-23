export enum TokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET = 'reset',
  VERIFY = 'verify',
}

export enum ApplicationMode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum DocumentSortBy {
  SIZE = 'size',
  NAME = 'name',
  UPDATED_AT = 'updatedAt',
  CREATED_AT = 'createdAt',
  TYPE = 'type',
}

export enum ItemType {
  FOLDER = 'folder',
  FILE = 'file',
  LINK = 'link',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

export const FileExtensions = {
  [ItemType.IMAGE]: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
    'tiff',
    'avif',
  ],
  [ItemType.FOLDER]: ['folder'],
  [ItemType.LINK]: ['link'],
  [ItemType.VIDEO]: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
  [ItemType.AUDIO]: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'wma'],
  [ItemType.DOCUMENT]: [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
  ],
};

export enum BullQueues {
  EMAIL_QUEUE = 'email-queue',
  FILE_UPLOAD_QUEUE = 'file-upload-queue',
  FILE_PROCESS_QUEUE = "file-process-queue"
}



export enum ActionType {
  SHARE = 'share',
  ARCHIVED = 'archived',
  UNARCHIVED = 'un-archived',
  FAVORITE = 'favorite',
  UNFAVORITE = 'un-favorite',
}

export enum UserRole {
  MANAGER = 'Manager',
  ASSOCIATE = 'Associate',
  ADMIN = 'Client Admin',
}
