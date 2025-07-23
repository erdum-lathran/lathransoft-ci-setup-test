import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExecutionTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime(); // Capture start time

    res.on('finish', () => {
      // Listen for the response to be sent
      const end = process.hrtime(start); // Get the time difference
      const totalSeconds = end[0] + end[1] / 1e9;

      // Convert to minutes and seconds
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = (totalSeconds % 60).toFixed(3);

      console.log(
        `Execution Time for ${req.method} ${req.originalUrl}: ${minutes} minutes and ${seconds} seconds`,
      );
    });

    next(); // Move to the next middleware or controller
  }
}
