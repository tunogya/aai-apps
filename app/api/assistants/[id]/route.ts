import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { BatchWriteCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";
import openai from "@/app/utils/openai";
import OpenAI from "openai";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;

  try {
    // get asst info by assistant id
    const cache = await redisClient.get(`ASST#${params.id}`);
    return NextResponse.json({
      item: cache,
      cache: true,
    });
  } catch (e) {
    console.log(e);
  }

  const openai = new OpenAI();
  const assistant = await openai.beta.assistants.retrieve(params.id);

  await redisClient.set(`ASST#${params.id}`, JSON.stringify(assistant));

  return NextResponse.json({
    item: assistant,
  });
};

const PATCH = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const { name, description, instructions, metadata, model } = await req.json();

  try {
    const cache = await redisClient.get(`ASST#${params.id}`);
    const newAssistant = await openai.beta.assistants.update(params.id, {
      name,
      description,
      instructions,
      model,
      metadata: {
        // @ts-ignore
        ...(cache?.metadata || {}),
        ...metadata,
      },
    });
    const item = {
      ...newAssistant,
      PK: `USER#${sub}`,
      SK: `ASST#${params.id}`,
    };
    const uniqueId = dysortid();
    await Promise.all([
      ddbDocClient.send(
        new BatchWriteCommand({
          RequestItems: {
            "abandonai-prod": [
              {
                PutRequest: {
                  Item: {
                    PK: `ASST#${params.id}`,
                    SK: `EVENT#${uniqueId}`,
                    type: "assistant.put",
                    updated: Math.floor(Date.now() / 1000),
                    TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
                  },
                },
              },
            ],
          },
        }),
      ),
      redisClient.set(`ASST#${params.id}`, JSON.stringify(item)),
    ]);
    return NextResponse.json({
      updated: true,
      item,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "something went wrong",
        message: e,
      },
      {
        status: 500,
      },
    );
  }
};

const DELETE = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    const openai = new OpenAI();
    const response = await openai.beta.assistants.del(params.id);
    if (response?.deleted) {
      const cache = redisClient.get(`ASST#${params.id}`);
      await Promise.all([
        ddbDocClient.send(
          new DeleteCommand({
            TableName: "abandonai-prod",
            Key: {
              PK: `USER#${sub}`,
              SK: `ASST#${params.id}`,
            },
          }),
        ),
        redisClient.del(`ASST#${params.id}`),
        // @ts-ignore
        redisClient.del(`ASST_ID#${cache?.metadata?.telegram || ""}`),
      ]);
      return NextResponse.json({
        id: params.id,
        deleted: true,
      });
    } else {
      return NextResponse.json(
        {
          error: "something went wrong",
          message: response,
        },
        {
          status: 500,
        },
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        error: "something went wrong",
        message: e,
      },
      {
        status: 500,
      },
    );
  }
};

export { GET, PATCH, DELETE };
