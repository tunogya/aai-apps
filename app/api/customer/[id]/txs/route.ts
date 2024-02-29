import { NextRequest, NextResponse } from "next/server";
import stripeClient from "@/app/utils/stripeClient";

const GET = async (req: NextRequest, { params }: any) => {
  const balanceTransactions =
    // @ts-ignore
    await stripeClient.customers.listBalanceTransactions(params.id, {
      limit: 20,
    });

  return NextResponse.json(
    balanceTransactions.data.filter((item) => item.currency === "usd"),
  );
};

export { GET };
