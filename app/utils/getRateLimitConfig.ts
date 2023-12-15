import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "@/app/utils/redisClient";

type Unit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

const getRateLimitConfig = (prefix: string, product: string) => {
  let tokens: number,
    window: Duration,
    content_window: number = 0;
  switch (prefix) {
    case "ratelimit:/api/chat:gpt-4":
      if (product === process.env.PREMIUM_STANDARD_PRODUCT) {
        tokens = 50;
        window = "12 h";
        content_window = 2048;
        break;
      } else if (product === process.env.PREMIUM_PRO_PRODUCT) {
        tokens = 50;
        window = "6 h";
        content_window = 4096;
        break;
      } else if (product === process.env.PREMIUM_MAX_PRODUCT) {
        tokens = 50;
        window = "3 h";
        content_window = 4096;
        break;
      } else {
        // AbandonAI Free
        tokens = 0;
        window = "3 h";
        content_window = 0;
        break;
      }
    case "ratelimit:/api/chat:gpt-3.5":
      if (product === process.env.PREMIUM_STANDARD_PRODUCT) {
        tokens = 50;
        window = "1 h";
        content_window = 2048;
        break;
      } else if (product === process.env.PREMIUM_PRO_PRODUCT) {
        tokens = 100;
        window = "1 h";
        content_window = 4096;
        break;
      } else if (product === process.env.PREMIUM_MAX_PRODUCT) {
        tokens = 200;
        window = "1 h";
        content_window = 4096;
        break;
      } else {
        // AbandonAI Free
        tokens = 5;
        window = "1 h";
        content_window = 1024;
        break;
      }
    case "ratelimit:/api/images/generations:dalle3":
      if (product === process.env.PREMIUM_STANDARD_PRODUCT) {
        tokens = 10;
        window = "1 h";
        break;
      } else if (product === process.env.PREMIUM_PRO_PRODUCT) {
        tokens = 20;
        window = "1 h";
        break;
      } else if (product === process.env.PREMIUM_MAX_PRODUCT) {
        tokens = 40;
        window = "1 h";
        break;
      } else {
        // AbandonAI Free
        tokens = 0;
        window = "1 h";
        break;
      }
    default:
      tokens = 0;
      window = "3 h";
      break;
  }
  const ratelimit = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
    prefix: "ratelimit:/api/chat:gpt-4",
  });
  return {
    ratelimit,
    content_window,
  };
};

export default getRateLimitConfig;
