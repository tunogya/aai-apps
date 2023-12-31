import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import {
  BatchWriteCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";
import openai from "@/app/utils/openai";
import OpenAI from "openai";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;

  try {
    // Check Redis
    try {
      // get asst info by assistant id
      const cache = await redisClient.get(`ASST#${params.id}`);
      if (cache) {
        // @ts-ignore
        if (cache?.metadata?.telegram) {
          // cache telegram token => assistant id
          await redisClient.set(
            // @ts-ignore
            `ASST_ID#${cache?.metadata?.telegram}`,
            params?.id,
          );
        }
        return NextResponse.json({
          item: cache,
          cache: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
    // Check DynamoDB
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `USER#${sub}`,
          SK: `ASST#${params?.id}`,
        },
      }),
    );
    if (Item) {
      // Add to Redis
      await redisClient.set(`ASST#${params.id}`, JSON.stringify(Item));
      // If you have a telegram account, need to update in redis
      if (Item?.metadata?.telegram) {
        await redisClient.set(
          `ASST_ID#${Item?.metadata?.telegram}`,
          params?.id,
        );
      }
      return NextResponse.json(
        {
          item: Item,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=1",
            "CDN-Cache-Control": "public, s-maxage=60",
            "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
          },
        },
      );
    } else {
      return NextResponse.json(
        {
          item: null,
        },
        {
          status: 404,
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
                  Item: item,
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: `ASST#${params.id}`,
                    SK: `EVENT#${uniqueId}`,
                    data: item,
                    type: "assistant.put",
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
