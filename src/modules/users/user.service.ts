import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Users } from 'src/models/users.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) { }

  async findBy(key: string, value: any, select: (keyof Users)[] = []) {
    const queryOptions: any = {
      where: { [key]: value },
    };

    // Check if specific fields are provided, else fetch all fields
    if (select.length > 0) {
      queryOptions.select = select; // Assign select fields
    }

    return await this.usersRepository.findOne(queryOptions);
  }

  async findAll(conditions?: Partial<Users>) {
    return this.usersRepository.find({
      where: conditions as FindOptionsWhere<Users>, // Cast karte hue
    });
  }

  async findAllByTenant(tenantId: number, userId: number) {
    return this.usersRepository.find({
      where: {
        tenantId,
        userId: Not(userId),
      },
      select: ['userId', 'email', 'firstName', 'lastName']
    });
  }
  async deleteByUserId(userId: string): Promise<any> {
    // console.log('user: ', userId);
    return await this.usersRepository.delete(userId);
  }


  async create(userData: Partial<Users>) {
    const user = this.findBy('email', userData.email);
    if (!user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const result = this.usersRepository.create(userData);
    return this.usersRepository.save(result);
  }

  async update(id: number, updateData: Partial<Users>) {
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOne({ where: { userId: id } });
  }

  async updateUserStorage(id: number, storage: number) {
    const user = await this.findBy('userId', id);
    user.totalStorage = storage;
    await this.usersRepository.save(user);
  }
}
