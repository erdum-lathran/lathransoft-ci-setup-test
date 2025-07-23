import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudService } from '../common/cloud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from 'src/models/documents.modal';
import { In, Not, Repository, MoreThan } from 'typeorm';
import { FileDto, FolderDto, LinkDto } from 'src/dto/document.dto';
import {
  ActionType,
  BullQueues,
  FileExtensions,
  ItemType,
  SortOrder,
} from 'src/enum';
import Utils from 'src/utils';
import { DocumentFavorites } from 'src/models/documentFavorites.modal';
import { DocumentArchives } from 'src/models/documentArchives.modal';
import { ResponseUtil } from 'src/utils/response.utils';
import { Messages } from 'src/utils/messages';
import { MailerService } from 'src/mailer/mailer.service';
import { Users } from 'src/models/users.model';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RedisCacheService } from '../common/cache.service';
import { DocumentShares } from 'src/models/documentShares.modal';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Documents)
    private documentRepository: Repository<Documents>,
    @InjectRepository(DocumentFavorites)
    private documentFavoritesRepository: Repository<DocumentFavorites>,
    @InjectRepository(DocumentShares)
    private documentSharesRepository: Repository<DocumentShares>,
    @InjectRepository(DocumentArchives)
    private documentArchivesRepository: Repository<DocumentArchives>,
    @InjectQueue(BullQueues.FILE_UPLOAD_QUEUE) private uploadQueue: Queue,
    private readonly cloudService: CloudService,
    private readonly mailerService: MailerService,
    private redisCacheService: RedisCacheService,
  ) { }

  private queSettings = {
    attempts: 20,
    delay: 0,
    removeOnComplete: true,
  };

  // async getDocuments(
  //   parentId: number = 0,
  //   userId: number,
  //   tenantId: number,
  //   search: string,
  //   isPaginated: number = 1,
  //   page: number = 1,
  //   limit: number = 10,
  //   toDate: string,
  //   fromDate: string,
  //   sortBy: string,
  //   orderBy: SortOrder,
  //   isFavourite: number,
  //   isShared: number,
  //   isDeleted: number,
  //   isArchived: number,
  //   type: string,
  // ) {
  //   // Ensure valid values for pagination
  //   page = page < 1 ? 1 : page;
  //   limit = limit < 1 ? 10 : limit;

  //   let cacheKey = 'documents:';
  //   if (tenantId) cacheKey += `${tenantId}:`;
  //   if (userId) cacheKey += `${userId}:`;
  //   if (parentId) cacheKey += `${parentId}:`;
  //   if (isPaginated) cacheKey += `${isPaginated}:`;
  //   if (page) cacheKey += `${page}:`;
  //   if (limit) cacheKey += `${limit}:`;
  //   if (isShared) cacheKey += `${isShared}:`;
  //   if (isFavourite) cacheKey += `${isFavourite}:`;
  //   if (isDeleted) cacheKey += `${isDeleted}:`;
  //   if (isArchived) cacheKey += `${isArchived}:`;
  //   if (search) cacheKey += `${search}:`;
  //   if (fromDate) cacheKey += `${fromDate}:`;
  //   if (toDate) cacheKey += `${toDate}:`;
  //   if (sortBy) cacheKey += `${sortBy}:`;
  //   if (type) cacheKey += `${type}:`;

  //   // Check if the result is already cached in Redis
  //   const cachedResult = await this.redisCacheService.getCache(cacheKey);

  //   if (cachedResult) {
  //     console.log("Returning cached result");
  //     return ResponseUtil.success(cachedResult, Messages.getSuccessfully); // Return cached result if found
  //   }

  //   // Convert to UTC if dates are provided
  //   const fromDateUTC = fromDate ? new Date(fromDate).toISOString() : null;
  //   const toDateUTC = toDate ? new Date(toDate).toISOString() : null;

  //   // Proceed to execute the database query if no cache is found
  //   const query = this.documentRepository
  //     .createQueryBuilder('document')
  //     .leftJoin(
  //       'DocumentFavorites',
  //       'favorites',
  //       'favorites.documentId = document.id AND favorites.userId = :userId',
  //       { userId },
  //     )
  //     .leftJoin(
  //       'DocumentArchives',
  //       'archives',
  //       'archives.documentId = document.id AND archives.userId = :userId',
  //       { userId },
  //     )
  //     .addSelect('users.email', 'ownerEmail')
  //     .leftJoin('Users', 'users', 'users.userId = document.userId')
  //     .andWhere('document.tenantId = :tenantId', { tenantId });

  //   if (isShared === 1) {
  //     query
  //       .leftJoin(
  //         'DocumentShares',
  //         'shared',
  //         'shared.documentId = document.id AND shared.sharedWithUserId = :userId',
  //         { userId },
  //       )
  //       .andWhere('shared.id IS NOT NULL');
  //   } else {
  //     query.andWhere('document.parentId = :parentId', { parentId });
  //     query.andWhere('document.userId = :userId', { userId });
  //   }

  //   if (isDeleted === 1) {
  //     query.andWhere('document.isDeleted = true');
  //   } else {
  //     query.andWhere('document.isDeleted = false');
  //   }

  //   if (fromDateUTC) {
  //     query.andWhere('document.createdAt >= :fromDate', { fromDate: fromDateUTC });
  //   }

  //   if (toDateUTC) {
  //     query.andWhere('document.createdAt <= :toDate', { toDate: toDateUTC });
  //   }

  //   if (search && search.length > 0) {
  //     query.andWhere('document.name LIKE :search', { search: `%${search}%` });
  //   }

  //   if (sortBy && orderBy) {
  //     query.orderBy(`document.${sortBy}`, orderBy);
  //   }

  //   if (isFavourite === 1) {
  //     query.andWhere('favorites.id IS NOT NULL');
  //   }

  //   if (isArchived === 1) {
  //     query.andWhere('archives.id IS NOT NULL');
  //   } else {
  //     query.andWhere('archives.id IS NULL');
  //   }

  //   if (type) {
  //     const extensions = FileExtensions[type];

  //     if (extensions) {
  //       query.andWhere('document.format IN (:...extensions)', { extensions });
  //     }
  //   }

  //   query.addSelect(
  //     'CASE WHEN favorites.id IS NOT NULL THEN true ELSE false END',
  //     'isFavorite',
  //   );

  //   query.addSelect(
  //     'CASE WHEN archives.id IS NOT NULL THEN true ELSE false END',
  //     'isArchived',
  //   );

  //   // Get total count first (without pagination)
  //   const totalCount = await query.getCount();

  //   // Apply pagination if isPaginated is 1
  //   if (isPaginated === 1) {
  //     const offset = (page - 1) * limit;
  //     query.offset(offset).limit(limit);
  //   }

  //   // Get documents based on the query
  //   const documents = await query.getRawMany();

  //   // Transform document keys
  //   const transformedDocuments = await this.transformDocumentKeys(documents);

  //   const response = {
  //     documents: transformedDocuments,
  //     totalCount: isPaginated === 1 ? totalCount : documents.length,
  //     totalPages: isPaginated === 1 ? Math.ceil(totalCount / limit) : 1,
  //     currentPage: isPaginated === 1 ? page : 1,
  //     hasMore: isPaginated === 1 ? page * limit < totalCount : false,
  //   };

  //   // Cache the result in Redis for future requests
  //   await this.redisCacheService.setCache(cacheKey, response);

  //   return ResponseUtil.success(response, Messages.getSuccessfully); // Return response
  // }

  async getDocuments(
    parentId: number = 0,
    userId: number,
    tenantId: number,
    search: string,
    isPaginated: number = 1,
    page: number = 1,
    limit: number = 10,
    toDate: string,
    fromDate: string,
    sortBy: string,
    orderBy: SortOrder,
    isFavourite: number,
    isShared: number,
    isDeleted: number,
    isArchived: number,
    type: string,
  ) {
    // Ensure valid values for pagination
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;

    let cacheKey = 'documents:';
    if (tenantId) cacheKey += `${tenantId}:`;
    if (userId) cacheKey += `${userId}:`;
    if (parentId) cacheKey += `${parentId}:`;
    if (isPaginated) cacheKey += `${isPaginated}:`;
    if (page) cacheKey += `${page}:`;
    if (limit) cacheKey += `${limit}:`;
    if (isShared) cacheKey += `${isShared}:`;
    if (isFavourite) cacheKey += `${isFavourite}:`;
    if (isDeleted) cacheKey += `${isDeleted}:`;
    if (isArchived) cacheKey += `${isArchived}:`;
    if (search) cacheKey += `${search}:`;
    if (fromDate) cacheKey += `${fromDate}:`;
    if (toDate) cacheKey += `${toDate}:`;
    if (sortBy) cacheKey += `${sortBy}:`;
    if (type) cacheKey += `${type}:`;

    // Check if the result is already cached in Redis
    const cachedResult = await this.redisCacheService.getCache(cacheKey);
    if (cachedResult) {
      return ResponseUtil.success(cachedResult, Messages.getSuccessfully); // Return cached result if found
    }

    // Proceed to execute the database query if no cache is found
    const query = this.documentRepository
      .createQueryBuilder('document')
      .leftJoin(
        'DocumentFavorites',
        'favorites',
        'favorites.documentId = document.id AND favorites.userId = :userId',
        { userId },
      )
      .leftJoin(
        'DocumentArchives',
        'archives',
        'archives.documentId = document.id AND archives.userId = :userId',
        { userId },
      )
      .addSelect('users.email', 'ownerEmail')
      .addSelect('archives.createdAt', 'archivedAt')
      .addSelect('favorites.createdAt', 'favoritesAt')
      .leftJoin('Users', 'users', 'users.userId = document.userId')
      .andWhere('document.tenantId = :tenantId', { tenantId });

    console.log('isShared: ', isShared);
    if (isShared === 1) {
      console.log('Fetching shared documents...');
      query
        .leftJoin(
          'DocumentShares',
          'shared',
          // 'shared.documentId = document.id AND (shared.sharedWithUserId = :userId OR document.userId = :userId)',
          'shared.documentId = document.id AND (shared.sharedWithUserId = :userId OR shared.sharedByUserId = :userId)',
          { userId },
        )
        .andWhere('shared.id IS NOT NULL');

      // console.log('Final SQL:', query.getSql());
      // console.log('Params:', query.getParameters());


      // const results = await query.getRawMany();
      // console.log('Results:', results);
    } else {
      if (parentId) {
        // console.log('parentId: ', parentId);

        const descendantIds = await this.getAllDescendantDocumentIds(parentId);
        const folderAndDescendants = [parentId, ...descendantIds];
        query.andWhere('document.id IN (:...folderAndDescendants)', {
          folderAndDescendants,
        });
        // console.log('descendantIds: ', descendantIds);
        // console.log('folderAndDescendants: ', folderAndDescendants);
      } else {
        query.andWhere('document.userId = :userId', { userId });

      }
    }

    if (isDeleted === 1) {
      query.andWhere('document.isDeleted = true');
    } else {
      query.andWhere('document.isDeleted = false');
    }

    query.andWhere('document.id != :parentId', { parentId });


    // Use the raw fromDate and toDate (no conversion to UTC)
    let dateField = 'document.createdAt';
    if (isFavourite === 1) {
      dateField = 'favorites.createdAt';
    } else if (isArchived === 1) {
      dateField = 'archives.createdAt';
    }

    if (fromDate && toDate) {
      const testDate = new Date();
      const fromPK = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      const from = new Date(new Date(fromDate).setUTCHours(0, 0, 0, 0));
      const toPK = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      const to = new Date(new Date(toDate).setUTCHours(23, 59, 59, 999));
      // console.log('fromPK: ==>>checkDatefrom', fromPK);
      // console.log('toPK: ==>>checkDatefrom', toPK);
      // console.log('from: ==>>checkDatefrom', from);
      // console.log('fromDate: ==>>checkDatefrom ', fromDate);
      // console.log('to: ==>>checkDateto', to);
      // console.log('toDate: ==>>checkDateto', toDate);

      // console.log('testDate: ', testDate);


      query.andWhere(`${dateField} BETWEEN :from AND :to`, {
        from,
        to,
      });
      // const allDocs = await query.getRawMany();
      // allDocs.forEach(doc => console.log("compare date==>> ", doc.createdAt || doc[dateField]))

    }

    if (search && search.length > 0) {
      query.andWhere('document.name LIKE :search', { search: `%${search}%` });
    }

    if (sortBy && orderBy) {
      query.orderBy(`document.${sortBy}`, orderBy);
    }

    if (isFavourite === 1) {
      query.andWhere('favorites.id IS NOT NULL');
    }

    if (isArchived === 1) {
      query.andWhere('archives.id IS NOT NULL');
    } else {
      query.andWhere('archives.id IS NULL');
    }

    if (type) {
      const extensions = FileExtensions[type];

      if (extensions) {
        query.andWhere('document.format IN (:...extensions)', { extensions });
      }
    }

    query.addSelect(
      'CASE WHEN favorites.id IS NOT NULL THEN true ELSE false END',
      'isFavorite',
    );

    query.addSelect(
      'CASE WHEN archives.id IS NOT NULL THEN true ELSE false END',
      'isArchived',
    );

    // Get total count first (without pagination)
    const totalCount = await query.getCount();

    // Apply pagination if isPaginated is 1
    if (isPaginated === 1) {
      const offset = (page - 1) * limit;
      query.offset(offset).limit(limit);
    }

    // Get documents based on the query
    const documents = await query.getRawMany();
    console.log('documents: ', documents);

    // Transform document keys
    const transformedDocuments = await this.transformDocumentKeys(documents);

    const response = {
      documents: transformedDocuments,
      totalCount: isPaginated === 1 ? totalCount : documents.length,
      totalPages: isPaginated === 1 ? Math.ceil(totalCount / limit) : 1,
      currentPage: isPaginated === 1 ? page : 1,
      hasMore: isPaginated === 1 ? page * limit < totalCount : false,
    };

    // Cache the result in Redis for future requests
    // console.log('response: ', response);
    await this.redisCacheService.setCache(cacheKey, response);

    // console.log('response: ==>>', response);
    return ResponseUtil.success(response, Messages.getSuccessfully); // Return response
  }

  async uploadFiles(
    fileDto: FileDto,
    files: Express.Multer.File[],
    userId: number,
    tenantId: number,
  ) {
    const existingDocs = await this.documentRepository.find({
      where: {
        parentId: fileDto.parentId,
        tenantId,
        userId,
      },
      select: ['name'],
    });

    const existingNames = new Set<string>(existingDocs.map(doc => doc.name));
    const jobs = files.map((file) => {
      const originalName = Utils.fileOriginalName(file);
      const uniqueName = this.getUniqueName(originalName, existingNames, false);
      existingNames.add(uniqueName);

      return this.uploadQueue.add(
        BullQueues.FILE_PROCESS_QUEUE,
        {
          fileDto,
          file,
          userId,
          tenantId,
          originalName: uniqueName,
          format: Utils.getFileType(file),
        },
        this.queSettings,
      );
    });

    // Wait for all the jobs to be added to the queue and get their ids along with the file names
    const jobResults = await Promise.all(
      jobs.map((job) =>
        job.then((res) => {
          return {
            jobId: res?.id,
            name: res?.data?.originalName,
            format: res?.data?.format,
          };
        }),
      ),
    );

    await this.redisCacheService.invalidateCacheForDocument(tenantId, userId);

    return jobResults;
  }

  async createFolder(folderDto: FolderDto, userId: number, tenantId: number) {
  const existingFolders = await this.documentRepository.find({
    where: {
      parentId: folderDto.parentId || 0,
      tenantId,
      userId,
      type: ItemType.FOLDER,
    },
    select: ['name'],
  });

  const existingNames = new Set(existingFolders.map(f => f.name));
  const uniqueFolderName = this.getUniqueName(folderDto.name, existingNames, false, true);
    const folder = {
      tenantId: tenantId,
      userId: userId,
      name: uniqueFolderName,
      isPrivate: true,
      parentId: folderDto.parentId || 0,
      type: ItemType.FOLDER,
      format: ItemType.FOLDER,
    };
    await this.redisCacheService.invalidateCacheForDocument(tenantId, userId);
    const result = await this.documentRepository.save(folder);
    return result;
  }

  async getFolder(
    userId: number,
    tenantId: number,
    parentId: number,
    folderId: number,
  ) {
    let whereCondition: any = {
      tenantId: tenantId,
      userId: userId,
      parentId: parentId,
    };
    if (parentId === 0) {
      whereCondition.type = ItemType.FOLDER;
    } else {
      whereCondition.type = In([ItemType.FOLDER, ItemType.FILE]);
    }

    if (folderId && folderId != 0) {
      whereCondition = {
        ...whereCondition,
        id: Not(folderId),
      };
    }
    const result = await this.documentRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
    const data = await Promise.all(
      result.map(async (ele) => ({
        ...ele,
        itemCount:
          ele.type === ItemType.FOLDER
            ? await this.calculateChildCount(ele.id)
            : undefined,
      })),
    );

    return data;
  }

  async createLink(linkDto: LinkDto, userId: number, tenantId: number) {
    const link = {
      tenantId,
      userId,
      name: linkDto.name,
      url: linkDto.url,
      isPrivate: true,
      parentId: linkDto.parentId | 0,
      type: ItemType.LINK,
      format: ItemType.LINK,
    };
    const result = await this.documentRepository.save(link);
    await this.redisCacheService.invalidateCacheForDocument(tenantId, userId);
    return result;
  }

  async renameDocument(id: number, name: string) {
    const document = await this.documentRepository.findOne({
      where: { id: id },
    });
    console.log('document: ', document);

    if (!document) {
      throw new Error('Document not found');
    }
    const isFolder = document.type === 'folder';
    if (!isFolder) {
      const ext = document.format;
      const newKey = `${name}_${Date.now()}.${ext}`;
      if (ext !== "folder") {

        // const oldKey = document.key || document.name;
        // const oldPath = path.join('uploads', oldKey);
        // const newPath = path.join('uploads', newKey);
        try {

          document.key = newKey;
          // await fs.access(oldPath);
          // await fs.rename(oldPath, newPath);
        } catch (err) {
          console.error('File rename error:', err.message);
          throw new Error('Failed to rename file');
        }
      }
    }

    document.name = name;
    const updatedDoc = await this.documentRepository.save(document);
    return updatedDoc;
  }

  async softDeleteDocuments(
    documentIds: number[],
    userId: number,
    tenantId: number,
  ): Promise<any> {
    // Step 1: Find all documents that need to be updated
    const documentsToUpdate = await this.documentRepository.findBy({
      id: In(documentIds),
    });

    // Step 2: Update isDeleted and deletedAt
    documentsToUpdate.forEach((doc) => {
      doc.isDeleted = true;
      doc.deletedAt = new Date();
    });
    await this.documentArchivesRepository.delete({
      userId,
      documentId: In(documentIds),
    });

    // Step 3: Save updated documents (Triggers @AfterUpdate Hook)
    const updatedDocuments =
      await this.documentRepository.save(documentsToUpdate);

    await this.redisCacheService.invalidateCacheForDocument(tenantId, userId);

    return updatedDocuments;
  }

  async restoreDocuments(documentIds: number[]): Promise<any> {
    // Step 1: Find documents with the given IDs
    const documents = await this.documentRepository.find({
      where: { parentId: In(documentIds) },
      select: ['id'],
    });

    // await this.redisCacheService.invalidateCacheForDocument(
    //   documents[0].tenantId,
    //   documents[0].userId,
    // );

    const allIdsToDelete = [...documentIds, ...documents.map((doc) => doc.id)];
    // // Step 4: Soft delete the documents and their parent documents
    await this.documentRepository.update(
      { id: In(allIdsToDelete) },
      { isDeleted: false, deletedAt: null },
    );

    return `${allIdsToDelete.length} documents have been soft deleted.`;
  }

  async moveDocuments(
    sourceIds: number[],
    destinationId: number,
    userId: number,
    tenantId: number,
  ): Promise<Documents[]> {
    const documentsToMove: Documents[] = [];
    const parentIdMap = new Map<number, number>();
    await this.walkDocumentsTree(
      sourceIds,
      async (doc, newParentId) => {
        const movedDoc = { ...doc, parentId: newParentId };
        documentsToMove.push(movedDoc);
        parentIdMap.set(doc.id, movedDoc.id);
      },
      destinationId,
    );

    const destinationDocuments = await this.documentRepository.find({
      where: { parentId: destinationId },
    });

    documentsToMove.filter((sourceDoc) =>
      destinationDocuments.some((destDoc) => {
        const fullSourceName = `${sourceDoc.name}.${sourceDoc.format}`;
        const fullDestName = `${destDoc.name}.${destDoc.format}`;

        if (destDoc.id === sourceDoc.id) {
          throw new HttpException(
            `Already exist ${fullSourceName}`,
            HttpStatus.CONFLICT,
          );
        }
        if (fullDestName === fullSourceName) {
          throw new HttpException(
            `Rename required for ${fullSourceName}`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return false;
      }),
    );

    const updatedDocuments =
      await this.documentRepository.save(documentsToMove);
    await this.redisCacheService.invalidateCacheForDocument(tenantId, userId);
    return updatedDocuments;
  }

  getUniqueName(originalName: string, existingNames: Set<string>, isCopy = false, isFolder = false): string {
  let baseName = originalName;
  let extension = '';

  if (!isFolder) {
    const nameParts = originalName.split('.');
    extension = nameParts.length > 1 ? '.' + nameParts.pop() : '';
    baseName = nameParts.join('.');

    const copyRegex = /( - copy(?: \(\d+\))?)$/;
    baseName = baseName.replace(copyRegex, '');
  } else {
    const copyRegexFolder = /( \(\d+\))$/;
    baseName = baseName.replace(copyRegexFolder, '');
  }

    let newName = `${baseName}${extension}`;
    if (!existingNames.has(newName)) {
      existingNames.add(newName);
      return newName;
    }

    const suffixBase = isCopy ? ' - copy' : '';
    let counter = 0;
    while (true) {
      const suffix = counter === 0
        ? (isCopy ? `${suffixBase}` : ` (${1})`)
        : `${suffixBase} (${counter})`;
      newName = isFolder
      ? `${baseName} (${counter === 0 ? 1 : counter})`
      : `${baseName}${suffix}${extension}`;

      if (!existingNames.has(newName)) break;
      counter++;
    }

    existingNames.add(newName);
    return newName;
  }

  async copyDocuments(
    sourceIds: number[],
    destinationId: number,
    userId: number,
    tenantId: number,
  ): Promise<Documents[]> {
    const documentsToInsert: Partial<Documents & { originalId: number, tempParentId: number | null }>[] = [];
    const nameSet = new Set<string>();

    const originalIdToTempDoc = new Map<number, Partial<Documents & { originalId: number }>>();
    const originalToNewIdMap = new Map<number, number>();

    // STEP 1: Collect documents recursively
    await this.walkDocumentsTree(
      sourceIds,
      async (doc, newParentId) => {
        const newName = this.getUniqueName(doc.name, nameSet);
        const newDoc: Partial<Documents & { originalId: number, tempParentId: number | null }> = {
          ...doc,
          id: undefined,
          name: newName,
          userId,
          tenantId,
          parentId: 0, // Will fix later
          createdAt: new Date(),
          updatedAt: new Date(),
          originalId: doc.id,
          tempParentId: doc.parentId,
        };
        documentsToInsert.push(newDoc);
        originalIdToTempDoc.set(doc.id, newDoc);
        nameSet.add(newName);
      },
      destinationId,
    );

    // Step 2: Insert all documents with dummy parentId (0 or destinationId)
    const inserted = await this.documentRepository.insert(documentsToInsert);
    const insertedIds = inserted.identifiers.map(i => i.id);

    // Step 3: Reload inserted docs with their real IDs
  const insertedDocs = await this.documentRepository.findBy({
  id: In(insertedIds),
    });

    // STEP 4: Map original -> new IDs
    for (const insertedDoc of insertedDocs) {
      const matched = documentsToInsert.find(
        d => d.name === insertedDoc.name && d.userId === insertedDoc.userId,
      );
      if (matched?.originalId) {
        originalToNewIdMap.set(matched.originalId, insertedDoc.id);
      }
    }

    // Step 5: Update parentId mapping in memory (only if you need correct hierarchy)
    const docsToUpdate = [];
    for (const insertedDoc of insertedDocs) {
      const originalDoc = Array.from(documentsToInsert).find(
        d => d.name === insertedDoc.name,
      );

      if (!originalDoc) continue;

      const originalParentId = originalDoc.tempParentId;

      let newParentId: number;

      // If the original document was a root selected source
      if (sourceIds.includes(originalDoc.originalId)) {
        newParentId = destinationId;
      } else {
        newParentId = originalParentId && originalToNewIdMap.get(originalParentId)
          ? originalToNewIdMap.get(originalParentId)!
          : destinationId;
      }

      if (insertedDoc.parentId !== newParentId) {
        insertedDoc.parentId = newParentId;
        docsToUpdate.push(insertedDoc);
      }
    }

    // Step 6: Save parentId updates (only once)
    if (docsToUpdate.length > 0) {
      await this.documentRepository.save(docsToUpdate);
    }

    await this.redisCacheService.invalidateCacheForDocument(tenantId, userId);
    return insertedDocs;
  }


  async walkDocumentsTree(
    rootIds: number[],
    processNode: (doc: Documents, parentId: number | null) => Promise<void>,
    initialParentId: number | null = null,
  ): Promise<void> {
    const walk = async (currentId: number, newParentId: number | null) => {
      const current = await this.documentRepository.findOneBy({
        id: currentId,
      });
      if (!current) return;

      await processNode(current, newParentId);

      const children = await this.documentRepository.find({
        where: { parentId: currentId },
      });

      for (const child of children) {
        await walk(child.id, current.id);
      }
    };

    for (const id of rootIds) {
      await walk(id, initialParentId);
    }
  }

  async removeFile(filePath: string) {
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
      } else {
        console.error(`Error deleting file at ${filePath}:`, err);
      }
    }
  }

  async emptyTrash(userId: number, tenantId: number) {
    const documents = await this.documentRepository.find({
      where: { isDeleted: true, userId, tenantId },
      select: ['id', 'key'],
    });

    for (const doc of documents) {
      if (!doc.key) {
        continue;
      }
      const filePath = path.join('uploads', doc.key);
      try {
        await this.removeFile(filePath);
      } catch (err) {
        console.error(
          `Error deleting file from local storage: ${filePath}`,
          err,
        );
      }
      try {
        await this.cloudService.deleteFromR2(doc.key);
      } catch (err) {
        console.error(`Error deleting file from R2: ${doc.key}`, err);
      }
    }
    this.documentRepository.delete({ isDeleted: true, userId, tenantId });
    return 'Trash emptied successfully.';
  }

  async permenetlyDelete(documentIds: number[]): Promise<any> {
    const documents = await this.documentRepository.find({
      where: { id: In(documentIds) },
      select: ['id', 'key'],
    });

    for (const doc of documents) {
      if (!doc.key) continue;
      try {
        await this.cloudService.deleteFromR2(doc.key);
      } catch (err) {
        console.error(`Failed to delete from R2: ${doc.key}`, err);
      }
      const filePath = path.join('uploads', doc.key);
      try {
        await this.removeFile(filePath);
      } catch (err) {
        console.error(`Local file delete failed: ${filePath}`, err);
      }
    }
    const allIdsToDelete = [...documentIds, ...documents.map((doc) => doc.id)];
    await this.documentRepository.delete(allIdsToDelete);

    return `${allIdsToDelete.length} documents have been deleted.`;
  }

  async toggleFavoriteDocuments(
    userId: number,
    documentIds: number[],
    action: ActionType,
  ) {
    // Validate documents exist
    const validDocumentIds = await this.documentRepository
      .find({
        where: { id: In(documentIds) },
        select: ['id'],
      })
      .then((docs) => docs.map((doc) => doc.id));

    if (validDocumentIds.length === 0) {
      throw new HttpException(
        'No valid documents found for the operation.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (action === ActionType.FAVORITE) {
      const alreadyFavoritedIds = await this.documentFavoritesRepository
        .find({
          where: { userId, documentId: In(validDocumentIds) },
          select: ['documentId'],
        })
        .then((favorites) => new Set(favorites.map((fav) => fav.documentId)));

      // Prepare new favorites
      const newFavorites = validDocumentIds
        .filter((id) => !alreadyFavoritedIds.has(id))
        .map((id) => ({
          userId,
          documentId: id,
          createdAt: new Date(),
        }));

      if (newFavorites.length === 0) {
        return [];
      }

      // await this.redisCacheService.invalidateCacheForDocument(
      //   alreadyFavoritedIds[0].tenantId,
      //   alreadyFavoritedIds[0].userId,
      // );

      return this.documentFavoritesRepository.save(newFavorites);
    }

    if (action === ActionType.UNFAVORITE) {
      const deleteResult = await this.documentFavoritesRepository.delete({
        userId,
        documentId: In(validDocumentIds),
      });

      // await this.redisCacheService.invalidateCacheForDocument(
      //   deleteResult[0].tenantId,
      //   deleteResult[0].userId,
      // );
      return { affected: deleteResult.affected };
    }

    throw new HttpException(
      'Invalid action. Use "favorite" or "unfavorite".',
      HttpStatus.BAD_REQUEST,
    );
  }

  async toggleArchiveDocuments(
    userId: number,
    documentIds: number[],
    action: ActionType,
  ) {
    // Validate documents exist
    const validDocumentIds = await this.documentRepository
      .find({
        where: { id: In(documentIds) },
        select: ['id'],
      })
      .then((docs) => docs.map((doc) => doc.id));

    if (validDocumentIds.length === 0) {
      throw new HttpException(
        'No valid documents found for the operation.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (action === ActionType.ARCHIVED) {
      const alreadyFavoritedIds = await this.documentArchivesRepository
        .find({
          where: { userId, documentId: In(validDocumentIds) },
          select: ['documentId'],
        })
        .then((archived) => new Set(archived.map((arc) => arc.documentId)));

      // Prepare new favorites
      const newArchives = validDocumentIds
        .filter((id) => !alreadyFavoritedIds.has(id))
        .map((id) => ({
          userId,
          documentId: id,
          createdAt: new Date(),
        }));

      if (newArchives.length === 0) {
        return [];
      }

      // await this.redisCacheService.invalidateCacheForDocument(
      //   alreadyFavoritedIds[0].tenantId,
      //   alreadyFavoritedIds[0].userId,
      // );

      return this.documentArchivesRepository.save(newArchives);
    }

    if (action === ActionType.UNARCHIVED) {
      const deleteResult = await this.documentArchivesRepository.delete({
        userId,
        documentId: In(validDocumentIds),
      });

      // await this.redisCacheService.invalidateCacheForDocument(
      //   deleteResult[0].tenantId,
      //   deleteResult[0].userId,
      // );

      return { affected: deleteResult.affected };
    }

    throw new HttpException(
      'Invalid action. Use "archive" or "unarchive".',
      HttpStatus.BAD_REQUEST,
    );
  }
  async findAllFilesInFolderRecursive(
    folderId: number,
  ): Promise<{ key: string; path: string }[]> {
    const results: { key: string; path: string }[] = [];
    const walk = async (currentFolderId: number, currentPath: string) => {
      const children = await this.documentRepository.find({
        where: { parentId: currentFolderId },
      });
      for (const item of children) {
        if (item.type === 'folder') {
          const newPath = `${currentPath}/${item.name}`;
          await walk(item.id, newPath);
        } else if (item.type === 'file') {
          results.push({
            key: item.key,
            path: `${currentPath}/${item.name}`,
          });
        }
      }
    };
    const rootFolder = await this.documentRepository.findOne({
      where: { id: folderId },
    });
    const rootPath = rootFolder?.name || 'Folder';
    await walk(folderId, rootPath);
    return results;
  }

  async downloadFiles(ids: number[]): Promise<Readable> {
    const fileList: { key: string; path: string }[] = [];
    for (const id of ids) {
      const item = await this.documentRepository.findOne({ where: { id } });
      if (!item) {
        continue;
      }
      if (item.type === 'file') {
        if (!item.key) {
          continue;
        }
        fileList.push({ key: item.key, path: item.name });
      }
      if (item.type === 'folder') {
        const folderFiles = await this.findAllFilesInFolderRecursive(item.id);
        fileList.push(...folderFiles);
      }
    }
    if (fileList.length === 0) {
      throw new Error('No valid files found to download.');
    }
    return this.cloudService.downloadFolderFiles(fileList);
  }

  async getAllDescendantDocumentIds(parentId: number): Promise<number[]> {
    const result: number[] = [];

    async function recurse(id: number) {
      const children = await this.documentRepository.find({
        where: { parentId: id },
        select: ['id'],
      });
      for (const child of children) {
        result.push(child.id);
        await recurse.call(this, child.id);
      }
    }

    await recurse.call(this, parentId);
    return result;
  }
  async shareFolder(
    documentId: number,
    sharedByUserId: number,
    sharedWithUserIds: number[],
    permission: 'view' | 'edit' | 'delete',
  ) {
    try {
      const descendantIds = await this.getAllDescendantDocumentIds(documentId);
      const allDocumentIds = [documentId, ...descendantIds];

      for (const docId of allDocumentIds) {
        const existingShares = await this.documentSharesRepository.find({
          where: { documentId: docId, sharedWithUserId: In(sharedWithUserIds) },
        });

        const existingShareMap = new Map(
          existingShares.map((share) => [share.sharedWithUserId, share]),
        );

        const newShares = sharedWithUserIds
          .filter((id) => !existingShareMap.has(id))
          .map((id) => ({
            documentId: docId,
            sharedByUserId,
            sharedWithUserId: id,
            permission,
          }));

        const updateShares = existingShares.filter(
          (share) => share.permission !== permission,
        );
        updateShares.forEach((share) => (share.permission = permission));

        if (newShares.length > 0) {
          await this.documentSharesRepository.insert(newShares);
        }

        if (updateShares.length > 0) {
          await this.documentSharesRepository.save(updateShares);
        }
      }

      const doc = await this.documentRepository.findOne({
        where: { id: documentId },
        select: ['userId', 'name', 'key'],
      });

      const sharedByUser = await this.userRepository.findOne({
        where: { userId: sharedByUserId },
        select: ['userId', 'firstName', 'lastName'],
      });
      if (!sharedByUser) throw new Error('Shared by user not found.');

      const users = await this.userRepository.find({
        where: { userId: In(sharedWithUserIds) },
        select: ['userId', 'email', 'firstName', 'lastName'],
      });

      const email = users.map((user) => ({
        documentId,
        email: user.email,
        documentName: doc.name,
        link: `${process.env.WEB_APP_URL}/folder-detail?parent_folder_id=${documentId}&isShared=1`,
        sender: `${sharedByUser.firstName} ${sharedByUser.lastName}`,
        receiver: `${user.firstName} ${user.lastName}`,
      }));

      await this.mailerService.shareDocumentEmail(email);

      return { message: 'Batch sharing process completed.' };
    } catch (error) {
      throw new Error('An error occurred while sharing the document.');
    }
  }

  private async calculateChildCount(id: number) {
    const childCount = await this.documentRepository.count({
      where: { parentId: id, isDeleted: false },
    });

    return childCount;
  }

  private async transformDocumentKeys(documents: any[]) {
    // Use Promise.all to wait for all async operations to finish
    return Promise.all(
      documents.map(async (doc: any) => {
        const transformed: any = {};

        // Transform the keys
        Object.keys(doc).forEach((key) => {
          const newKey = key.includes('_') ? key.split('_')[1] : key;
          transformed[newKey] = doc[key];
        });
        // Wait for async calculation of child count
        const itemCount =
          transformed.type === ItemType.FOLDER
            ? await this.calculateChildCount(transformed.id)
            : 0;

        return {
          ...transformed,
          itemCount,
          key:
            transformed.key == null
              ? null
              : `${process.env.R2_WORKER}/${transformed.key}`,
          //: `${process.env.ASSETS_BASE_URL}uploads/${transformed.key}`,
          isDeleted: Boolean(transformed.isDeleted),
          isPrivate: Boolean(transformed.isPrivate),
          isFavorite: transformed.isFavorite == '1',
          isArchived: transformed.isArchived == '1',
        };
      }),
    );
  }
}
