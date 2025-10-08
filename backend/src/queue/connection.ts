import { env } from '../config/env.js';

export const bullConnection = {
  url: env.redisUrl || 'redis://localhost:6379',
};

