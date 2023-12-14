import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import dysortid from "@/app/utils/dysortid";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
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
  const session = await stripeClient.billingPortal.sessions.create({
    customer: customer,
    return_url: req.nextUrl.origin + `/chat/${dysortid()}`,
  });
  return NextResponse.json({
    session: session,
  });
};

export { POST };
