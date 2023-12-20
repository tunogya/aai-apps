import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import {
  BatchWriteCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import OpenAI from "openai";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;

  try {
    // Check Redis
    try {
      const cache = await redisClient.get(`USER#${sub}:ASST#${params.id}`);
      if (cache) {
        // @ts-ignore
        if (cache?.telegram) {
          // @ts-ignore
          await redisClient.set(`${cache?.telegram}:assistant_id`, params?.id);
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
      await redisClient.set(
        `USER#${sub}:ASST#${params.id}`,
        JSON.stringify(Item),
      );
      // If have telegram account, need to update in redis
      if (Item?.telegram) {
        await redisClient.set(`${Item?.telegram}:assistant_id`, params?.id);
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
    const openai = new OpenAI();
    const cache = await redisClient.get(`USER#${sub}:ASST#${params.id}`);
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
      redisClient.set(`USER#${sub}:ASST#${params.id}`, JSON.stringify(item)),
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
      const cache = redisClient.get(`USER#${sub}:ASST#${params.id}`);
      // @ts-ignore
      if (cache.telegram) {
        // @ts-ignore
        await redisClient.del(`${cache.telegram}:assistant_id`);
      }
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
        redisClient.del(`USER#${sub}:ASST#${params.id}`),
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
