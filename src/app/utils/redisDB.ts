/* eslint-disable no-console */
import { Redis } from 'ioredis';
import config from '../config';

if (!config.redis_url) {
  throw new Error('❌ Redis connection failed: redis_url is missing in config');
}

export const redis = new Redis(config.redis_url);

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});
