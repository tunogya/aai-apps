import { Redis } from "@upstash/redis";

const redisClient = Redis.fromEnv();

export default redisClient;
