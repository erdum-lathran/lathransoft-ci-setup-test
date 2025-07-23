import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DocumentFavorites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  documentId: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
