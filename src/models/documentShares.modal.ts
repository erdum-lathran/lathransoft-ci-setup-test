import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DocumentShares {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  documentId: number; // Document ID

  @Column({ type: 'int', nullable: false })
  sharedByUserId: number; // User who shared the document

  @Column({ type: 'int', nullable: true }) // NULL means public link
  sharedWithUserId: number;

  @Column({ type: 'boolean', default: false }) // Public access
  isPublic: boolean;

  @Column({ type: 'enum', enum: ['view', 'edit', 'delete', 'owner'], default: 'view' })
  permission: string; // Permissions: view, edit, delete, owner

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date; // Expiration for temporary shares

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}

