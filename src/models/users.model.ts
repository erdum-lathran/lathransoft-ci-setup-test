import { UserRole } from 'src/enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'int', nullable: true })
  tenantId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  profileImage: string; 

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
    default: UserRole.ADMIN,
  })
  role: UserRole;
   
  @Column({ type: 'int', default: 0 })
  totalStorage: number;

  @Column({ type: 'varchar', nullable: true })
  otp: string;

  @Column({ type: 'datetime', nullable: true })
  otpExpires: Date;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isNewUser: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;


  // Verify the password with the hashed password
  async verifyPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
   if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  
}
