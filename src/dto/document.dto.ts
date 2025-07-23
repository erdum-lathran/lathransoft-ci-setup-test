import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class FileDto {
  @ApiProperty({
    description: 'The parent ID of the file',
    example: 0, // This will show null as an example in Swagger UI
    required: false, // Mark as optional
  })
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId: number;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  files: Express.Multer.File[] | Express.Multer.File;
}

export class FolderDto {
  @ApiProperty({
    description: 'The parent ID of the folder',
    example: 0, // This will show null as an example in Swagger UI
    required: false, // Mark as optional
  })
  @IsOptional()
  parentId: number;

  @ApiProperty({
    description: 'The name of the folder',
    example: 'New Folder', // This will show null as an example in Swagger UI
    required: true, // Mark as optional
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name: string;
}

export class LinkDto {
  @ApiProperty({
    description: 'The parent ID of the file',
    example: 0, // This will show null as an example in Swagger UI
    required: false, // Mark as optional
  })
  @IsOptional()
  parentId: number;

  @ApiProperty({
    description: 'The parent ID of the link',
    example: 'Google Link', // This will show null as an example in Swagger UI
    required: true, // Mark as optional
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The url of the link',
    example: 'https://www.google.com', // This will show null as an example in Swagger UI
    required: true, // Mark as optional
  })
  @IsOptional()
  @IsString({ message: 'url must be a string' })
  url: string;
}

export class RenameDto {
  @ApiProperty({
    description: 'Write the new name of the document',
    example: 'New Name', // This will show null as an example in Swagger UI
    required: true, // Mark as optional
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name: string;
}

export class DocumentsIDsDto {
  @ApiProperty({
    description: 'Array of document IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  documentIds: number[];
}

export class MoveCopyDto {
  @ApiProperty({
    description: 'Array of document IDs to be moved or copied',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  sourceIds: number[]; // Renamed from fromIds to sourceIds

  @ApiProperty({
    description: 'ID of the destination folder',
    example: 1,
    type: Number,
  })
  @IsInt()
  destinationId: number; // Renamed from toId to destinationId
}

export class ShareDocumentDto {
  @ApiProperty({ example: 10, description: 'Document ID to share' })
  @IsInt()
  @IsNotEmpty()
  documentId: number;

  @ApiProperty({ example: 1, description: 'User who is sharing the document' })
  @IsInt()
  @IsNotEmpty()
  sharedByUserId: number;

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
    description: 'User with whom the document is being shared',
  })
  @IsArray()
  @IsInt({ each: true })
  sharedWithUserId: number[];

  @ApiProperty({
    example: 'view',
    enum: ['view', 'edit', 'delete'],
    description: 'Permission level',
  })
  @IsEnum(['view', 'edit', 'delete'])
  permission: 'view' | 'edit' | 'delete';
}
