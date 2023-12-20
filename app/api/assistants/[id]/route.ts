import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import {
  BatchWriteCommand,
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
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
      return NextResponse.json({
        item: Item,
      });
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

const PUT = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const { name, description, instructions, metadata, model } = await req.json();

  try {
    const openai = new OpenAI();
    const newAssistant = await openai.beta.assistants.update(params.id, {
      name,
      description,
      instructions,
      model,
      metadata,
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
                    createdAt: new Date(),
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
    const uniqueId = dysortid();
    await Promise.all([
      ddbDocClient.send(
        new UpdateCommand({
          TableName: "abandonai-prod",
          Key: {
            PK: `USER#${sub}`,
            SK: `ASST#${params.id}`,
          },
          UpdateExpression: UpdateExpression || undefined,
          ExpressionAttributeNames: ExpressionAttributeNames || undefined,
          ExpressionAttributeValues: ExpressionAttributeValues || undefined,
          ConditionExpression: ConditionExpression || undefined,
        }),
      ),
      redisClient.del(`USER#${sub}:ASST#${params.id}`),
      ddbDocClient.send(
        new PutCommand({
          TableName: "abandonai-prod",
          Item: {
            PK: `ASST#${params.id}`,
            SK: `EVENT#${uniqueId}`,
            createdAt: new Date(),
            data: {
              UpdateExpression,
              ExpressionAttributeNames,
              ExpressionAttributeValues,
              ConditionExpression,
            },
            type: "assistant.patch",
          },
        }),
      ),
    ]);
    return NextResponse.json({
      updated: true,
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

export { GET, PUT, DELETE, PATCH };
