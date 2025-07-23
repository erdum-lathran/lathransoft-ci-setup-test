// import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
// import { SearchService } from './search.service';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Elasticsearch')
// @Controller('elasticsearch')
// export class SearchController {
//   constructor(private readonly elasticsearchService: SearchService) {}

//   @Post('index')
//   async createIndex(@Body() body: { index: string; settings: any }) {
//     return this.elasticsearchService.createIndex('docs', {});
//   }

//   @Delete('index/:index')
//   async deleteIndex(@Param('index') index: string) {
//     return this.elasticsearchService.deleteIndex(index);
//   }

//   @Post('document')
//   async indexDocument(
//     @Body() body: { index: string; id: string; document: any }
//   ) {
//     return this.elasticsearchService.indexDocument(body.index, body.id, body.document);
//   }

//   @Get('search')
//   async search(@Body() body: { index: string; query: any }) {
//     return this.elasticsearchService.search(body.index, body.query);
//   }

//   @Delete('document')
//   async deleteDocument(@Body() body: { index: string; id: string }) {
//     return this.elasticsearchService.deleteDocument(body.index, body.id);
//   }

//   @Post('document/update')
//   async updateDocument(
//     @Body() body: { index: string; id: string; doc: any }
//   ) {
//     return this.elasticsearchService.updateDocument(body.index, body.id, body.doc);
//   }
// }
