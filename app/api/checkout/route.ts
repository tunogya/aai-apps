import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const { line_items, mode, success_url, cancel_url, allow_promotion_codes } =
    await req.json();

  if (!user.email) {
    return NextResponse.json({
      error: "email required",
      message: "Please use email to login.",
    });
  }
  const customers = await stripeClient.customers.list({
    email: user.email,
  });
  let customer;
  if (customers.data.length === 0) {
    const { id } = await stripeClient.customers.create({
      email: user.email,
      name: user.nickname,
      metadata: {
        id: user.sub,
      },
    });
    customer = id;
  } else {
    customer = customers.data[0].id;
  }
  try {
    const session = await stripeClient.checkout.sessions.create({
      line_items,
      mode,
      success_url,
      cancel_url,
      allow_promotion_codes,
      customer: customer,
    });
    return NextResponse.json({
      session: session,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "Something went wrong",
      message: err.message,
    });
  }
};

export { POST };
