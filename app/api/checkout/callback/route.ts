import { NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import * as process from "process";

const POST = async (req: Request) => {
  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }
  // Successfully constructed event.
  console.log("✅ Success:", event.id);
  try {
    if (event.type === "checkout.session.completed") {
      const checkoutSessionCompleted = event.data
        .object as Stripe.Checkout.Session;
      const { id, customer_email, livemode } = checkoutSessionCompleted;
      if (livemode && customer_email) {
        // get customer info by email
        const customers = await stripeClient.customers.list({
          email: customer_email,
        });
        const customer = customers?.data?.[0] as Stripe.Customer;
        if (customer) {
          const lineItems =
            await stripeClient.checkout.sessions.listLineItems(id);
          for (const lineItem of lineItems.data) {
            const { price } = lineItem;
            if (price?.id === process.env.ONETIME_PREMIUM_STANDARD_PRICE) {
              await updateCustomerSubscription(
                process.env.PREMIUM_STANDARD_PRODUCT!,
                "premium_standard_expired",
                customer,
              );
            } else if (price?.id === process.env.ONETIME_PREMIUM_PRO_PRICE) {
              await updateCustomerSubscription(
                process.env.PREMIUM_PRO_PRODUCT!,
                "premium_pro_expired",
                customer,
              );
            } else if (price?.id === process.env.ONETIME_PREMIUM_MAX_PRICE) {
              await updateCustomerSubscription(
                process.env.PREMIUM_MAX_PRODUCT!,
                "premium_max_expired",
                customer,
              );
            }
          }
        } else {
          return NextResponse.json(
            { message: "404 customer not found" },
            { status: 200 },
          );
        }
      }
    } else if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.paused" ||
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.resumed"
    ) {
      const { customer: customer_id } = event.data
        .object as Stripe.Subscription;
      const customer = await stripeClient.customers.retrieve(
        customer_id as string,
      );
      // @ts-ignore
      if (customer?.metadata?.id) {
        // @ts-ignore
        await redisClient.del(`premium:${customer.metadata.id}`);
      } else {
        console.log("customer id not found");
      }
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Webhook handler failed" },
      { status: 500 },
    );
  }
  return NextResponse.json({ message: "Received" }, { status: 200 });
};

async function updateCustomerSubscription(
  productId: string,
  metadataKey: string,
  customer: Stripe.Customer,
) {
  const oldExpiredDate = new Date(
    Math.max(
      new Date(customer.metadata?.[metadataKey] || 0).getTime(),
      new Date().getTime(),
    ),
  );

  const newExpiredDate_str = new Date(
    oldExpiredDate.setDate(oldExpiredDate.getDate() + 31),
  ).toISOString();

  await stripeClient.customers.update(customer.id, {
    metadata: {
      ...(customer.metadata || {}),
      [metadataKey]: newExpiredDate_str,
    },
  });

  if (customer.metadata?.id) {
    await redisClient
      .set(
        `premium:${customer.metadata.id}`,
        JSON.stringify({
          customer: customer,
          subscription: {
            isPremium: true,
            product: productId,
            current_period_start: new Date().getTime() / 1000,
            current_period_end: new Date(newExpiredDate_str).getTime() / 1000,
          },
        }),
        {
          exat: Math.floor(new Date(newExpiredDate_str).getTime() / 1000),
        },
      )
      .catch(() => {
        console.log("redis error");
      });
  } else {
    console.log("customer id not found");
  }
}

export { POST };
