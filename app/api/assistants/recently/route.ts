import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";
import AUTH0_CERT from "@/app/utils/cert";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  let sub = session?.user.sub;
  if (!sub) {
    // get from header Authorization
    let token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        {
          error: "auth error",
        },
        {
          status: 500,
        },
      );
    }
    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, AUTH0_CERT, {
      algorithms: ["RS256"],
    });
    sub = decodedToken.sub;
  }

  // How to add?
  // redisClient.lrem(`ASST_RECENTLY#${sub}`, 0, newId)
  // redisClient.lpush(`ASST_RECENTLY#${sub}`, newId)
  // redisClient.ltrim(`ASST_RECENTLY#${sub}`, 0, 40)

  const cache = await redisClient.lrange(`ASST_RECENTLY#${sub}`, 0, -1);
  return NextResponse.json(cache);
};

export { GET };
