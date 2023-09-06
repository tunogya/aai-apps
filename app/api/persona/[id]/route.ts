import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import {
  DeleteCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const GET = withApiAuthRequired(async (req: NextRequest, { params }) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-dev",
        Key: {
          PK: sub,
          SK: `PERSONA#${params?.id}`,
        },
      }),
    );
    return NextResponse.json({
      item: Item,
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
});

const PATCH = withApiAuthRequired(async (req: NextRequest, { params }) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const needToUpdateObject = await req.json();
  const UpdateExpression = Object.keys(needToUpdateObject)
    .map((key) => `#${key} = :${key}`)
    .join(", ");
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  Object.keys(needToUpdateObject).forEach((key) => {
    // @ts-ignore
    ExpressionAttributeNames[`#${key}`] = key;
    // @ts-ignore
    ExpressionAttributeValues[`:${key}`] = needToUpdateObject[key];
  });
  try {
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: "abandonai-dev",
        Key: {
          PK: sub,
          SK: `PERSONA#${params?.id}`,
        },
        UpdateExpression: `SET ${UpdateExpression}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      }),
    );
    return NextResponse.json({
      update: true,
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
});

const DELETE = withApiAuthRequired(async (req: NextRequest, { params }) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: "abandonai-dev",
        Key: {
          PK: sub,
          SK: `PERSONA#${params?.id}`,
        },
      }),
    );
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
});

export { GET, PATCH, DELETE };
