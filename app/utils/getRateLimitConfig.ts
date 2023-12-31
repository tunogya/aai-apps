import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "@/app/utils/redisClient";

type Unit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

const getRateLimitConfig = (prefix: string) => {
  let tokens: number, window: Duration;
  switch (prefix) {
    case "ratelimit:/api/chat:gpt-4":
      tokens = 50;
      window = "3 h";
      break;
    case "ratelimit:/api/chat:gpt-3.5":
      tokens = 100;
      window = "1 h";
      break;
    case "ratelimit:/api/images/generations:dalle3":
      tokens = 40;
      window = "1 h";
      break;
    case "ratelimit:/api/chat/recommend":
      tokens = 10;
      window = "30 m";
      break;
    default:
      tokens = 0;
      window = "3 h";
      break;
  }

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: prefix,
  });
};

export default getRateLimitConfig;
