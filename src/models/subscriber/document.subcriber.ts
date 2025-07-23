import { Injectable } from '@nestjs/common';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Documents } from '../documents.modal';
import { SearchService } from 'src/modules/search/search.service';

@Injectable()
@EventSubscriber()
export class DocumentsSubscriber implements EntitySubscriberInterface<Documents> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly elasticsearchService: SearchService, // Inject Elasticsearch Service
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Documents;
  }

  /**
   * Handle insert event: Index the new document in Elasticsearch
   */
  // async afterInsert(event: InsertEvent<Documents>) {
  //   console.log('Inserted Document:', event.entity);
  //   await this.elasticsearchService.indexDocument(event.entity);

  //   // Increment parent folder's itemCount if applicable
  //   if (event.entity.parentId) {
  //     await event.manager
  //       .createQueryBuilder()
  //       .update(Documents)
  //       .set({ itemCount: () => 'itemCount + 1' })
  //       .where('id = :parentId', { parentId: event.entity.parentId })
  //       .execute();
  //   }
  // }

  /**
   * Handle update event: Update the document in Elasticsearch
   */
  // async afterUpdate(event: UpdateEvent<Documents>) {
  //   console.log('Updated Document:', event);

  //   if (event.entity) {
  //     await this.elasticsearchService.updateDocument(event.entity);
  //   }
  // }

  /**
   * Handle remove event: Delete the document from Elasticsearch
   */
  // async afterRemove(event: RemoveEvent<Documents>) {
  //   // console.log('Deleted Document:', event.entity);

  //   if (event.entity) {
  //     await this.elasticsearchService.deleteDocument(event.entity.id);

  //     // Decrement parent folder's itemCount if applicable
  //     if (event.entity.parentId) {
  //       await event.manager
  //         .createQueryBuilder()
  //         .update(Documents)
  //         .set({ itemCount: () => 'itemCount - 1' })
  //         .where('id = :parentId', { parentId: event.entity.parentId })
  //         .execute();
  //     }
  //   }
  // }
}
