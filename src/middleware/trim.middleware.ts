import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TrimMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Function to recursively trim all string values in the request body
    const trimValues = (obj: any) => {
      if (typeof obj === 'string') {
        return obj.trim();
      } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            obj[key] = trimValues(obj[key]);
          }
        }
      }
      return obj;
    };
    // Apply trimming to the body, query, and params
    req.body = trimValues(req.body);
    req.query = trimValues(req.query);
    req.params = trimValues(req.params);
    // Move to the next middleware or route handler
    next();
  }
}
