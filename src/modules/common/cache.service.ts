import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  private redisClient: Redis;

  constructor(
    private readonly configService: ConfigService,
  ) {
    // Create a new Redis client
    this.redisClient = new Redis({

      host: this.configService.get('REDIS_HOST', '213.139.205.218'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD', ''),
    });
  }

  // Get cached data from Redis by key
  async getCache(key: string): Promise<any> {
    // const result = await this.redisClient.get(key);
    // return result ? JSON.parse(result) : null;
  }

  // Set data to cache in Redis by key
  async setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
    // await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // Delete data from Redis cache by key
  async delCache(): Promise<void> {
    await this.redisClient.flushall();
  }

  // Method to invalidate cache for a specific document
  async invalidateCacheForDocument(tenantId: number, userId: number) {
    // const keys = await this.redisClient.keys(`documents:${tenantId}:${userId}:*`);
    // for (let key of keys) {
    //   await this.redisClient.del(key);
    // }
  }
}
