import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import ddbDocClient from "@/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import redisClient from "@/utils/redisClient";
import { roundUp } from "@/utils/roundUp";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const cache = await redisClient.get(`today:${sub}`);
  if (cache) {
    return NextResponse.json(cache);
  }

  const today = new Date();
  let rawData: any[] = [],
    startKey = undefined;

  while (true) {
    try {
      // @ts-ignore
      const { Items, LastEvaluatedKey, Count } = await ddbDocClient.send(
        new QueryCommand({
          TableName: "abandonai-prod",
          KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
          ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK",
          },
          ExpressionAttributeValues: {
            ":pk": `USER#${sub}`,
            ":sk": `USAGE#${today.toISOString().slice(0, 10)}`,
          },
          ProjectionExpression: "total_cost, created, model",
          ExclusiveStartKey: startKey,
        }),
      );

      if (Count && Count > 0) {
        rawData = rawData.concat(Items);
        if (LastEvaluatedKey) {
          startKey = LastEvaluatedKey;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          break;
        }
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }

  rawData = rawData.map((item) => {
    return {
      ...item,
      hour: Number(new Date(item.created * 1000).toISOString().slice(11, 13)),
    };
  });

  const data = [];

  for (let i = 0; i < 24; i++) {
    // sum of all rawData, where hour = i
    const sumOfGPT35 = rawData
      .filter((item) => item.hour === i && item.model?.startsWith("gpt-3.5"))
      ?.reduce((acc, item) => {
        return acc + item.total_cost;
      }, 0);
    const sumOfGPT4 = rawData
      .filter((item) => item.hour === i && item.model?.startsWith("gpt-4"))
      ?.reduce((acc, item) => {
        return acc + item.total_cost;
      }, 0);
    data.push({
      hour: i,
      gpt3_5: roundUp(sumOfGPT35, 6),
      gpt4: roundUp(sumOfGPT4, 6),
    });
  }

  await redisClient.set(`today:${sub}`, JSON.stringify(data), {
    ex: 60 * 5,
  });

  return NextResponse.json(data);
};

export { GET };
