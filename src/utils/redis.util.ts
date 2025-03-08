import Redis from 'ioredis';

const redis = new Redis({ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT || '6379') });

export async function setRedisValue(key: string, value: string, ttl?: number): Promise<void> {
  if (ttl) {
    await redis.set(key, value, 'EX', ttl);
  } else {
    await redis.set(key, value);
  }
}

export async function getRedisValue(key: string): Promise<string | null> {
  return await redis.get(key);
}

export async function deleteRedisValue(key: string): Promise<void> {
  await redis.del(key);
}

export async function checkRedisValue(key: string): Promise<boolean> {
  const value = await getRedisValue(key);
  return value !== null;
}





