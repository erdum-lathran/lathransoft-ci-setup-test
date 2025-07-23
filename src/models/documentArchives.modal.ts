import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DocumentArchives {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  documentId: number; // Document ID

  @Column({ type: 'int', nullable: false })
  userId: number; // User ID who archived the document

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date; // Timestamp when document was archived
}
