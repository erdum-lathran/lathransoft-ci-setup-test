import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { TokenTypes } from 'src/enum';
import { Tokens } from 'src/models/tokens.model';
import { Users } from 'src/models/users.model';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Tokens) private tokensRepository: Repository<Tokens>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async generateToken(
    user: Users,
    type: TokenTypes,
    expiresIn: string = '1d',
  ): Promise<string> {
    const { userId, tenantId, role } = user;
    const payload = {
      userId: userId,
      tenantId: tenantId,
      role: role,
      type: type,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: expiresIn,
    });

    return token;
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    return payload;
  }

  async verifySSOToken(payload: object) {
    const apiUrl = process.env.VALIDATE_TOKEN_API_URL;

    try {
      const response = await lastValueFrom(
        this.httpService.get(apiUrl, {
          params: payload,
        }),
      );
      
      return response?.data?.Success; // Return the API response data
    } catch (error) {
      // Handle error (log or throw a custom error)
      console.error('Error validating token:', error);
      throw error;
    }
  }
}
