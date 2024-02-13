import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import OpenAI from "openai";
import jwt from "jsonwebtoken";
import AUTH0_CERT from "@/app/utils/cert";

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

  const openai = new OpenAI();
  const list = await openai.beta.assistants.list({
    limit: 10,
    order: "desc",
  });
  return NextResponse.json(list.data);
};

export { GET };
