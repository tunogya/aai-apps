import { NextRequest, NextResponse } from "next/server";
import stripeClient from "@/app/utils/stripeClient";

const GET = async (req: NextRequest, { params }: any) => {
  const balanceTransactions =
    // @ts-ignore
    await stripeClient.customers.listBalanceTransactions(params.id, {
      limit: 20,
      starting_after:
        req.nextUrl.searchParams.get("starting_after") || undefined,
    });

  return NextResponse.json(
    balanceTransactions.data.filter((item) => item.currency === "usd"),
  );
};

export { GET };
