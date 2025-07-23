import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  LoginDTO,
  RegisterDTO,
  RegisterWithSSODTO,
  UpdateProfile,
} from 'src/dto/auth.dto';
import { TokenService } from '../tokens/token.service';
import { UserService } from '../users/user.service';
import { TokenTypes } from 'src/enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { Messages } from 'src/utils/messages';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/models/users.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokenService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) { }

  async getProfile(userId: number) {
    const user = await this.userService.findBy('userId', userId, [
      'userId',
      'tenantId',
      'email',
      'role',
      'firstName',
      'lastName',
      'phoneNumber',
      'profileImage'
    ]);
    return user;
  }

  async getProfileWithEmail(email: string) {
    const user = await this.userService.findBy('email', email, [
      'userId',
      'tenantId',
      'email',
      'role',
      'firstName',
      'lastName',
      'phoneNumber',
    ]);

    if (!user) {
      throw new HttpException(Messages.resourceNotFound, HttpStatus.NOT_FOUND);
    }

    return ResponseUtil.success(user);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findBy('email', email, [
      'userId',
      'tenantId',
      'email',
      'role',
      'firstName',
      'lastName',
      'password',
      'phoneNumber',
    ]);

    if (!user) {
      throw new HttpException(
        Messages.invalidCredentials,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      throw new HttpException(
        Messages.invalidCredentials,
        HttpStatus.FORBIDDEN,
      );
    }

    delete user.password;

    const access_token = await this.tokensService.generateToken(
      user,
      TokenTypes.ACCESS,
      process.env.JWT_EXPIRATION_FOR_ACCESS,
    );

    return { user, access_token };
  }

  async register(payload: RegisterDTO) {
    const user = await this.userService.create(payload);
    return user;
  }

  async loginSSO(
    token: string,
    email: string,
    application_code: string,
    username: string,
  ) {
    const payload = {
      token,
      email,
      application_code,
    };

    const isTokenValid = await this.tokensService.verifySSOToken(payload);

    if (isTokenValid) {
      const user = await this.userService.findBy('email', username, [
        'role',
        'tenantId',
        'userId',
      ]);

      if (!user) {
        throw new HttpException(Messages.loginFailed, HttpStatus.UNAUTHORIZED);
      }

      const token = await this.tokensService.generateToken(
        user,
        TokenTypes.ACCESS,
        process.env.JWT_EXPIRATION_FOR_ACCESS,
      );

      return token;
    }
    throw new HttpException(Messages.loginFailed, HttpStatus.UNAUTHORIZED);
  }

  async updateUser(existingUser: Partial<Users>, payload) {
    const updatableFields = ['firstName', 'lastName', 'phoneNumber', 'role', 'profileImage', 'isActive', 'password'];
    for (const field of updatableFields) {
     const value = payload[field];
    if (value !== undefined) {
      if (field === 'profileImage') {
        existingUser.profileImage = value === "remove" ? null : value;
      } else if (value !== null) {
        existingUser[field] = value;
      }
    }
  }

    await this.usersRepository.save(existingUser);
    return existingUser;                          
}


  async registerWithSSO(payload: RegisterWithSSODTO) {
    const existingUser = await this.userService.findBy('email', payload.email);

    if (!existingUser) {
      const registerPayload: RegisterDTO = {
        email: payload.email,
        password: payload.password,
        tenantId: payload.tenantId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        role: payload.role
      };
      return this.register(registerPayload);
    }
    const updatedUser = await this.updateUser(existingUser, payload);
    return updatedUser;
  }

  async deleteAccount(id: any, res: Response) {
    const existingUser = await this.userService.findBy('userId', id);
    // console.log('existingUser: ', existingUser);

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const deleteUser = await this.userService.deleteByUserId(id);
    return deleteUser
  }


}
