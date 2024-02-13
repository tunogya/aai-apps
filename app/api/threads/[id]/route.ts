import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import openai from "@/app/utils/openai";
import redisClient from "@/app/utils/redisClient";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const thread = await openai.beta.threads.retrieve(params.id);

  return NextResponse.json(thread);
};

const DELETE = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;

  await ddbDocClient.send(
    new DeleteCommand({
      TableName: "abandonai-prod",
      Key: {
        PK: `USER#${sub}`,
        SK: `THREAD#${params.id}`,
      },
    }),
  );
  await openai.beta.threads.del(params.id);
  await redisClient.del(`THREAD#${params.id}`);
  return NextResponse.json({ deleted: true });
};

export { GET, DELETE };
