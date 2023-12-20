import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import {
  DeleteCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    // Check Redis
    try {
      const cache = await redisClient.get(`USER#${sub}:CHAT2#${params?.id}`);
      if (cache) {
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
          SK: `CHAT2#${params?.id}`,
        },
      }),
    );
    if (Item) {
      // Add to Redis
      await redisClient.set(
        `USER#${sub}:CHAT2#${params.id}`,
        JSON.stringify(Item),
      );
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
    await Promise.all([
      ddbDocClient.send(
        new DeleteCommand({
          TableName: "abandonai-prod",
          Key: {
            PK: `USER#${sub}`,
            SK: `CHAT2#${params?.id}`,
          },
        }),
      ),
      redisClient.del(`USER#${sub}:CHAT2#${params.id}`),
    ]);
    return NextResponse.json({
      delete: true,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "something went wrong",
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
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression,
  } = await req.json();
  try {
    await Promise.all([
      ddbDocClient.send(
        new UpdateCommand({
          TableName: "abandonai-prod",
          Key: {
            PK: `USER#${sub}`,
            SK: `CHAT2#${params?.id}`,
          },
          UpdateExpression: UpdateExpression || undefined,
          ExpressionAttributeNames: ExpressionAttributeNames || undefined,
          ExpressionAttributeValues: ExpressionAttributeValues || undefined,
          ConditionExpression: ConditionExpression || undefined,
        }),
      ),
      redisClient.del(`USER#${sub}:CHAT2#${params.id}`),
    ]);
    return NextResponse.json({
      updated: true,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      {
        status: 500,
      },
    );
  }
};

export { GET, DELETE, PATCH };
