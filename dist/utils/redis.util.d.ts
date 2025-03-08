export declare function setRedisValue(key: string, value: string, ttl?: number): Promise<void>;
export declare function getRedisValue(key: string): Promise<string | null>;
export declare function deleteRedisValue(key: string): Promise<void>;
export declare function checkRedisValue(key: string): Promise<boolean>;
