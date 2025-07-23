import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const authHeader = request.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
          }

          // Extract token from cookies
          if (request.cookies && request.cookies.access_token) {
            return request.cookies.access_token;
          }

          return null; // No token found
        },
      ]),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET, // Secret key for token validation
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Unauthorized');
    }
    return payload; // Return payload to attach to request.user
  }
}
