import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly index = 'documents_index';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexDocument(document: any) {
    try {
      await this.elasticsearchService.index({
        index: this.index,
        id: document.id.toString(),
        body: document,
      });
      this.logger.log(`Document indexed in Elasticsearch: ${document.id}`);
    } catch (error) {
      this.logger.error(`Error indexing document: ${error.message}`);
    }
  }

  async updateDocument(document: any) {
    const docId = document.id.toString();

    delete document.id;

    try {
      await this.elasticsearchService.update({
        index: this.index,
        id: docId,
        body: {
          doc: document,
        },
      });
      this.logger.log(`Document updated in Elasticsearch: ${document.id}`);
    } catch (error) {
      this.logger.error(`Error updating document: ${error.message}`);
    }
  }

  async deleteDocument(id: number) {
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id: id.toString(),
      });
      this.logger.log(`Document deleted from Elasticsearch: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting document: ${error.message}`);
    }
  }
}
