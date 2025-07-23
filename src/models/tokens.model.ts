import { TokenTypes } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  tokenId: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'enum', enum: TokenTypes, nullable: true })
  type: TokenTypes;

  @Column({ type: 'datetime', nullable: true })
  expires: Date;

  @Column({ type: 'boolean', default: true })
  isBlock: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;
}
