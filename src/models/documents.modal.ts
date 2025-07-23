import { Inject } from '@nestjs/common';
import { ItemType } from 'src/enum';
import { SearchService } from 'src/modules/search/search.service';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Documents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  tenantId: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  key: string;

  @Column({ type: 'int', default: 0 })
  parentId: number;

  @Column({ type: 'int', default: 0 })
  itemCount: number;

  @Column({ type: 'text', nullable: true })
  format: string;

  @Column({ type: 'text', nullable: true }) // for link only
  url: string;

  @Column({ type: 'int', default: 0 })
  size: number;

  @Column({ type: 'text', nullable: true })
  readableSize: string;

  @Column({ type: 'enum', enum: ItemType, default: ItemType.FOLDER })
  type: ItemType;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  isPrivate: boolean; // If true, only owner & shared users can access

  @Column({ type: 'boolean', default: false })
  isPublic: boolean; // If true, anyone with link can access

  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;
}
