import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/models/users.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { UserModule } from '../users/user.module';
import { TokenModule } from '../tokens/token.module';
import { RedisCacheService } from '../common/cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    UserModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RedisCacheService],
  // exports: [AuthService],
})
export class AuthModule { }
