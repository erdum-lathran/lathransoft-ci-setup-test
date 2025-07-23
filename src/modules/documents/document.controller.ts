import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
// import { FileService } from '../files/file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  DocumentsIDsDto,
  FileDto,
  FolderDto,
  LinkDto,
  MoveCopyDto,
  RenameDto,
  ShareDocumentDto,
} from 'src/dto/document.dto';
import { Folder } from 'aws-sdk/clients/storagegateway';
import { Response as ExpressResponse } from 'express';
import { Request as ExpressRequest } from 'express';
import { ActionType, DocumentSortBy, SortOrder } from 'src/enum';
import { Messages } from 'src/utils/messages';
import { ResponseUtil } from 'src/utils/response.utils';
import { ParseArrayPipe } from '@nestjs/common';
@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    // private readonly fileService: FileService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiQuery({
    name: 'parentId',
    required: true,
    type: Number,
    description: 'parentId',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'search',
    example: '',
  })
  @ApiQuery({
    name: 'isPaginated',
    required: false,
    type: String,
    description: 'isPaginated',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'limit',
    example: '1',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'page',
    example: '1',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    description: 'toDate',
    example: '2025-01-26',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    description: 'fromDate',
    example: '2025-01-30',
  })
  @ApiQuery({
    name: 'sortBy',
    example: DocumentSortBy.NAME,
    description: 'orderBy',
    enum: DocumentSortBy,
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    enum: SortOrder,
    required: false,
    description: 'orderBy',
    example: SortOrder.ASC,
  })
  @ApiQuery({
    name: 'isFavourite',
    required: false,
    description: 'isFavourite',
    example: 0,
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    description: 'isDeleted',
    example: 0,
  })
  @ApiQuery({
    name: 'isArchived',
    required: false,
    description: 'isArchived',
    example: 0,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'type',
    example: 0,
  })
  @ApiOperation({ summary: 'Get Documents According to the type' })
  async getDocuments(
    @Request() req: any,
    @Query('parentId') parentId: number,
    @Query('isPaginated') isPaginated?: number,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('toDate') toDate?: string,
    @Query('fromDate') fromDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('orderBy') orderBy?: SortOrder,
    @Query('isFavorite') isFavorite?: number,
    @Query('isShared') isShared?: number,
    @Query('isDeleted') isDeleted?: number,
    @Query('isArchived') isArchived?: number,
    @Query('type') type?: string,
  ) {
    const { userId, tenantId } = req.user;
    const result = await this.documentService.getDocuments(
      parentId,
      userId,
      tenantId,
      search,
      isPaginated,
      page,
      limit,
      toDate,
      fromDate,
      sortBy,
      orderBy,
      isFavorite,
      isShared,
      isDeleted,
      isArchived,
      type,
    );
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('folders')
  @ApiQuery({
    name: 'parentId',
    required: false,
    description: 'parentId',
    example: 0,
  })
  @ApiQuery({
    name: 'folderId',
    required: false,
    description: 'folderId',
    example: 0,
  })
  @ApiOperation({ summary: 'Get folder' })
  async getFolder(
    @Request() req: any,
    @Query('parentId') parentId: number,
    @Query('folderId') folderId: number,
  ) {
    const { userId, tenantId } = req.user;
    const result = await this.documentService.getFolder(
      userId,
      tenantId,
      parentId,
      folderId,
    );

    return ResponseUtil.success(
      result,
      Messages.getSuccessfully,
      HttpStatus.OK,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('file/upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: {
        files: 20, // Maximum number of files allowed
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Multiple files' })
  async uploadFile(
    @Body() body: FileDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    const { userId, tenantId } = req.user;

    if (files.length == 0) {
      throw new HttpException(Messages.fileNotFound, HttpStatus.BAD_REQUEST);
    }
    // const result = await this.documentService.uploadDocuments(
    //   body,
    //   files,
    //   userId,
    //   tenantId,
    // );

    const result = await this.documentService.uploadFiles(
      body,
      files,
      userId,
      tenantId,
    );

    return ResponseUtil.success(result, null, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('folder/create')
  @ApiOperation({ summary: 'Folder Creation' })
  async createFolder(@Body() body: FolderDto, @Request() req: any) {
    const { userId, tenantId } = req.user;

    const result = await this.documentService.createFolder(
      body,
      userId,
      tenantId,
    );

    return ResponseUtil.success(result, null, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('link/create')
  @ApiOperation({ summary: 'Link Creation' })
  async createLink(@Body() body: LinkDto, @Request() req: any) {
    const { userId, tenantId } = req.user;
    const result = await this.documentService.createLink(
      body,
      userId,
      tenantId,
    );
    return ResponseUtil.success(
      result,
      Messages.createdSuccessfully,
      HttpStatus.OK,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('rename/:id')
  @ApiOperation({ summary: 'Rename a document' })
  async renameDocument(@Body() body: RenameDto, @Param('id') id: number) {
    const result = await this.documentService.renameDocument(id, body.name);
    return ResponseUtil.success(result, Messages.documentRenamed);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('favorite')
  @ApiOperation({ summary: 'Favorite bulk or single document' })
  async favorite(@Body() body: DocumentsIDsDto, @Request() req: any) {
    const { userId } = req.user;

    await this.documentService.toggleFavoriteDocuments(
      userId,
      body.documentIds,
      ActionType.FAVORITE,
    );

    return ResponseUtil.success(null, Messages.documentFavorite, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('un-favorite')
  @ApiOperation({ summary: 'Unfavorite bulk or single document' })
  async unFavorite(@Body() body: DocumentsIDsDto, @Request() req: any) {
    const { userId } = req.user;

    await this.documentService.toggleFavoriteDocuments(
      userId,
      body.documentIds,
      ActionType.UNFAVORITE,
    );

    return ResponseUtil.success(
      null,
      Messages.documentUnFavorite,
      HttpStatus.OK,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('archive')
  @ApiOperation({ summary: 'Archive bulk or single document' })
  async archive(@Body() body: DocumentsIDsDto, @Request() req: any) {
    const { userId } = req.user;

    await this.documentService.toggleArchiveDocuments(
      userId,
      body.documentIds,
      ActionType.ARCHIVED,
    );

    return ResponseUtil.success(null, Messages.documentArchived, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('un-archive')
  @ApiOperation({ summary: 'Unarchive bulk or single document' })
  async unArchive(@Body() body: DocumentsIDsDto, @Request() req: any) {
    const { userId } = req.user;

    await this.documentService.toggleArchiveDocuments(
      userId,
      body.documentIds,
      ActionType.UNARCHIVED,
    );

    return ResponseUtil.success(
      null,
      Messages.documentUnArchived,
      HttpStatus.OK,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('soft-delete')
  @ApiOperation({ summary: 'Soft delete bulk or single document' })
  async softDelete(@Body() body: DocumentsIDsDto, @Request() req: any) {
    const { userId, tenantId } = req.user;
    await this.documentService.softDeleteDocuments(body.documentIds, userId, tenantId);
    return ResponseUtil.success(null, Messages.documentDeleted, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('restore')
  @ApiOperation({ summary: 'Restore bulk or single document' })
  async restoreDocuments(@Body() body: DocumentsIDsDto) {
    await this.documentService.restoreDocuments(body.documentIds);
    return ResponseUtil.success(null, Messages.documentRestored);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('move')
  @ApiOperation({ summary: 'Move bulk document to single folder' })
  async moveDocuments(@Body() body: MoveCopyDto, @Request() req: any) {
    const { userId, tenantId } = req.user;
    await this.documentService.moveDocuments(
      body.sourceIds,
      body.destinationId,
      userId,
      tenantId,
    );
    return ResponseUtil.success(null, Messages.documentMoved);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('copy')
  @ApiOperation({ summary: 'Copy bulk document to single folder' })
  async copyDocuments(@Body() body: MoveCopyDto, @Request() req: any) {
    const { userId, tenantId } = req.user;
    await this.documentService.copyDocuments(
      body.sourceIds,
      body.destinationId,
      userId,
      tenantId,
    );
    return ResponseUtil.success(null, Messages.documentCopied);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('download')
  @ApiQuery({
    name: 'ids',
    required: true,
    type: [String],
    description: 'List of file keys to be downloaded',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk download of documents as a zip file.',
    content: {
      'application/zip': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async bulkDownload(@Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) ids: string[],
    @Res() res: Response) {
    try {
      // Fetch the zip stream
      const idsArray = ids.map(id => Number(id)).filter(id => !isNaN(id));
      const zipStream = await this.documentService.downloadFiles(idsArray);

      // Set headers for the zip file download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=download.zip');

      // Pipe the zip archive directly to the response
      zipStream.pipe(res);
    } catch (error) {
      // Handle errors if the download fails (e.g., invalid file ids)
      res.status(500).json({
        message: 'Error while processing the bulk download.',
        error: error.message || 'Unknown error',
      });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('download-folder')
  async downloadFolder(@Query('folderId') folderId: string, @Res() res: Response) {
    try {
      const folderIdNumber = parseInt(folderId, 10);
      const stream = await this.documentService.downloadFiles([folderIdNumber]);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=folder.zip');
      stream.pipe(res);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to download folder',
        error: err.message,
      });
    }
  }

  @Post('share')
  @ApiOperation({ summary: 'Share a document with another user' })
  @ApiResponse({ status: 201, description: 'Document shared successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async shareDocument(@Body() shareDocumentDto: ShareDocumentDto) {
    await this.documentService.shareFolder(
      shareDocumentDto.documentId,
      shareDocumentDto.sharedByUserId,
      shareDocumentDto.sharedWithUserId,
      shareDocumentDto.permission,
    );

    return ResponseUtil.success(null, Messages.documentShared);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('permenent-delete')
  @ApiOperation({ summary: 'Permenently delete bulk or single document' })
  async permenetlyDelete(@Body() body: DocumentsIDsDto) {
    await this.documentService.permenetlyDelete(body.documentIds);
    return ResponseUtil.success(null, Messages.documentPermanentlyDeleted);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('empty-trash')
  @ApiOperation({ summary: 'Empty trash' })
  async emptyTrash(@Request() req: any) {
    const { userId, tenantId } = req.user;
    await this.documentService.emptyTrash(userId, tenantId);
    return ResponseUtil.success(null, Messages.documentTrashEmptyed);
  }
}
