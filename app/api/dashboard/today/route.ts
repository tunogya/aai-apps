import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import ddbDocClient from "@/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { roundUp } from "@/utils/roundUp";
import redisClient from "@/utils/redisClient";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const cache = await redisClient.get(`today:${sub}`);
  if (cache) {
    return NextResponse.json(cache);
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const firstDay = new Date(year, month, 1);

  const dates = [];
  for (let i = 0; i < day; i++) {
    dates.push(`${year}-${month + 1}-${i + 1 < 9 ? "0" : ""}${i + 1}`);
  }

  let UsageItems: any[] = [],
    startKey = undefined;

  while (true) {
    // @ts-ignore
    const { Items, LastEvaluatedKey, Count } = await ddbDocClient.send(
      new QueryCommand({
        TableName: "abandonai-prod",
        KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
        FilterExpression: `#created >= :firstDay`,
        ExpressionAttributeNames: {
          "#pk": "PK",
          "#sk": "SK",
          "#created": "created",
        },
        ExpressionAttributeValues: {
          ":pk": `USER#${sub}`,
          ":sk": "USAGE#",
          ":firstDay": Math.floor(firstDay.getTime() / 1000),
        },
        ProjectionExpression: "total_cost, created, model",
        ExclusiveStartKey: startKey,
      }),
    );

    if (Count && Count > 0) {
      UsageItems = UsageItems.concat(Items);
      if (LastEvaluatedKey) {
        startKey = LastEvaluatedKey;
      } else {
        break;
      }
    } else {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const daily = dates.map((item) => ({
    date: item,
    gpt4: UsageItems?.filter((usageItem) => usageItem.model.startsWith("gpt-4"))
      ?.filter(
        (usageItem) =>
          new Date(usageItem.created * 1000).toISOString().slice(0, 10) ===
          item,
      )
      .reduce((acc, usageItem) => acc + usageItem.total_cost, 0),
    gpt3_5: UsageItems?.filter((usageItem) =>
      usageItem.model.startsWith("gpt-3.5"),
    )
      ?.filter(
        (usageItem) =>
          new Date(usageItem.created * 1000).toISOString().slice(0, 10) ===
          item,
      )
      .reduce((acc, usageItem) => acc + usageItem.total_cost, 0),
    total: UsageItems?.filter(
      (usageItem) =>
        new Date(usageItem.created * 1000).toISOString().slice(0, 10) === item,
    ).reduce((acc, usageItem) => acc + usageItem?.total_cost, 0),
  }));

  const data = {
    daily: daily.map((item) => ({
      ...item,
      total: roundUp(item?.total || 0, 6),
      gpt4: roundUp(item?.gpt4 || 0, 6),
      gpt3_5: roundUp(item?.gpt3_5 || 0, 6),
    })),
    cost: {
      today: daily?.[daily.length - 1]?.total || 0,
      yesterday: daily?.[daily.length - 2]?.total || 0,
      month: daily.reduce((acc, item) => acc + item.total!, 0),
    },
  };

  await redisClient.set(`today:${sub}`, JSON.stringify(data), {
    ex: 60 * 5,
  });

  return NextResponse.json(data);
};

export { GET };
