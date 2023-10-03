import { Redis } from "@upstash/redis";
import https from "https";

const redisClient = Redis.fromEnv({
  agent: new https.Agent({ keepAlive: true }),
});

export default redisClient;
