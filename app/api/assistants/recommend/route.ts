import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import OpenAI from "openai";
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

  const cache = await redisClient.get("ASST_RECOMMEND");
  if (cache) {
    return NextResponse.json(cache);
  }

  const openai = new OpenAI();
  const ids = [
    "asst_brkj4MSf9jfqjtXwpGAOBQWu",
    "asst_wsD0ZreDzksbDfe8VI1IaxpR",
  ];

  const res = await Promise.all(
    ids.map((id) => openai.beta.assistants.retrieve(id)),
  );

  await redisClient.set("ASST_RECOMMEND", JSON.stringify(res), {
    ex: 7 * 24 * 60 * 60,
  });

  return NextResponse.json(res);
};

export { GET };
