import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    async connectToRedis(): Promise<void> {
        const redisSocket = process.env.REDIS_SOCKET;
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
        const redisPassword = process.env.REDIS_PASSWORD;

        let pubClient;
        let subClient;

        if (redisSocket) {
            console.log(`🔌 Connecting to Redis via socket: ${redisSocket}`);
            pubClient = createClient({
                socket: { path: redisSocket },
                password: redisPassword || undefined,
            });
        } else {
            console.log(`🌐 Connecting to Redis via host: ${redisHost}:${redisPort}`);
            pubClient = createClient({
                socket: { host: redisHost, port: redisPort },
                password: redisPassword || undefined,
            });
        }

        subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
