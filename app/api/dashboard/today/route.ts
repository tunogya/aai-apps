import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import ddbDocClient from "@/utils/ddbDocClient";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { roundUp } from "@/utils/roundUp";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const numDays = new Date(year, month + 1, 0).getDate();

  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date(year, month, i + 1, 8, 0, 0);
    if (date <= today) {
      dates.push(date.toISOString().slice(0, 10));
    }
  }

  const { Items: UsageItems } = await ddbDocClient.send(
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
      ProjectionExpression: "total_cost, created",
    }),
  );

  const { Item: BalanceItem } = await ddbDocClient.send(
    new GetCommand({
      TableName: "abandonai-prod",
      Key: {
        PK: `USER#${sub}`,
        SK: `BALANCE`,
      },
    }),
  );

  const charts = dates.map((item) => ({
    date: item,
    total_cost: UsageItems?.filter(
      (usageItem) =>
        new Date(usageItem.created * 1000).toISOString().slice(0, 10) === item,
    ).reduce((acc, usageItem) => acc + usageItem.total_cost, 0),
  }));

  return NextResponse.json({
    charts: charts.map((item) => ({
      date: item.date,
      total_cost: roundUp(item?.total_cost || 0, 6),
    })),
    cost: {
      today: charts[charts.length - 1].total_cost,
      yesterday: charts[charts.length - 2].total_cost,
    },
    estimate: {
      month: 20,
    },
    advance_pay: {
      balance: BalanceItem?.balance || 0,
      status: BalanceItem?.balance >= 0 ? "NORMAL" : "LOCKED",
    },
  });
};

export { GET };
