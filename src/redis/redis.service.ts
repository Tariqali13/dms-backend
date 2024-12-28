import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis(); // Default Redis connection on localhost:6379
    }

    async set(key: string, value: any, expirationTimeInSeconds?: number): Promise<void> {
        if (expirationTimeInSeconds) {
            await this.client.set(key, JSON.stringify(value), 'EX', expirationTimeInSeconds);
        } else {
            await this.client.set(key, JSON.stringify(value));
        }
    }

    async get(key: string): Promise<any> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const count = await this.client.exists(key);
        return count > 0;
    }
}
