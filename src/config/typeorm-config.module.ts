import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigModule } from './environment-config.module';
import { Connection } from 'typeorm';
import { Users } from 'src/models/users.model';
import { Tokens } from 'src/models/tokens.model';
import { Documents } from 'src/models/documents.modal';
import { DocumentArchives } from 'src/models/documentArchives.modal';
import { DocumentFavorites } from 'src/models/documentFavorites.modal';
import { DocumentShares } from 'src/models/documentShares.modal';
import { DocumentsSubscriber } from 'src/models/subscriber/document.subcriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_NAME', 'document_management_system'),
        logging: false,
        entities: [
          Users,
          Tokens,
          Documents,
          DocumentArchives,
          DocumentFavorites,
          DocumentShares,
        ],
        synchronize: false, // Set to false in production for safety
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DocumentsSubscriber],
})
export class TypeOrmConfigModule implements OnModuleInit {
  private readonly logger = new Logger(TypeOrmConfigModule.name);

  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      // Ensuring the database connection is established
      if (this.connection.isConnected) {
        this.logger.log('Database connection established successfully.');
      } else {
        this.logger.warn('Database connection is not yet established.');
      }
    } catch (error) {
      // Handle connection errors gracefully
      this.logger.error('Database connection failed:', error.stack || error.message);
    }
  }
}
