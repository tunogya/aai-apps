import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const cursor = req?.nextUrl?.searchParams?.get("cursor") || undefined;
  const { Items, Count, LastEvaluatedKey } = await ddbDocClient.send(
    new QueryCommand({
      TableName: "abandonai-prod",
      KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#sk": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": `ASST#${params.id}`,
        ":sk": "THREAD#",
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: cursor
        ? {
            PK: `ASST#${params.id}`,
            SK: `THREAD#${cursor}`,
          }
        : undefined,
    }),
  );
  return NextResponse.json({
    items: Items,
    count: Count,
    nextCursor: LastEvaluatedKey?.SK.replace("THREAD#", "") || undefined,
  });
};

export { GET };
