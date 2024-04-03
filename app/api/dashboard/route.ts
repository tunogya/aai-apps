import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Redis } from "@upstash/redis";

const uri = process.env.MONGODB_URI!;

const redis = Redis.fromEnv();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const GET = async (req: NextRequest) => {
  const cache = await redis.get("auth0:users");
  if (cache) {
    return NextResponse.json({
      users: cache,
    });
  }
  await client.connect();
  const users = await client
    .db("core")
    .collection("auth0_users")
    .countDocuments();
  await redis.set("auth0:users", users, { ex: 60 * 5 });
  await client.close();
  return NextResponse.json({ users });
};

export { GET };
