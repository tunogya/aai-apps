import { NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";

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
      const { id, customer, livemode } = checkoutSessionCompleted;
      if (livemode && customer) {
        const lineItems =
          await stripeClient.checkout.sessions.listLineItems(id);
        for (const lineItem of lineItems.data) {
          const { price } = lineItem;
          if (price?.id === process.env.ONETIME_PREMIUM_STANDARD_PRICE) {
            const customerInfo = await stripeClient.customers.retrieve(
              customer as string,
            );
            let old_premium_standard_expired = new Date();
            if (
              // @ts-ignore
              customerInfo?.metadata?.premium_standard_expired &&
              new Date() <
                // @ts-ignore
                new Date(customerInfo.metadata.premium_standard_expired)
            ) {
              old_premium_standard_expired = new Date(
                // @ts-ignore
                customerInfo.metadata.premium_standard_expired,
              );
            }
            const new_premium_standard_expired = new Date(
              old_premium_standard_expired.setDate(
                old_premium_standard_expired.getDate() + 31,
              ),
            ).toISOString();
            await stripeClient.customers.update(customer as string, {
              metadata: {
                // @ts-ignore
                ...(customerInfo?.metadata || {}),
                premium_standard_expired: new_premium_standard_expired,
              },
            });
            // @ts-ignore
            if (customerInfo?.metadata?.id) {
              await redisClient
                .set(
                  // @ts-ignore
                  `premium:${customerInfo?.metadata?.id}`,
                  JSON.stringify({
                    customer: customerInfo,
                    subscription: {
                      name: "Premium Standard",
                      isPremium: true,
                    },
                  }),
                  {
                    exat:
                      new Date(new_premium_standard_expired).getTime() / 1000,
                  },
                )
                .catch(() => {
                  console.log("redis error");
                });
            }
          } else if (price?.id === process.env.ONETIME_PREMIUM_PRO_PRICE) {
            const customerInfo = await stripeClient.customers.retrieve(
              customer as string,
            );
            let old_premium_pro_expired = new Date();
            if (
              // @ts-ignore
              customerInfo?.metadata?.premium_pro_expired &&
              new Date() <
                // @ts-ignore
                new Date(customerInfo.metadata.premium_pro_expired)
            ) {
              old_premium_pro_expired = new Date(
                // @ts-ignore
                customerInfo.metadata.premium_pro_expired,
              );
            }
            const new_premium_pro_expired = new Date(
              old_premium_pro_expired.setDate(
                old_premium_pro_expired.getDate() + 31,
              ),
            ).toISOString();
            await stripeClient.customers.update(customer as string, {
              metadata: {
                // @ts-ignore
                ...(customerInfo?.metadata || {}),
                premium_pro_expired: new_premium_pro_expired,
              },
            });
            // @ts-ignore
            if (customerInfo?.metadata?.id) {
              await redisClient
                .set(
                  // @ts-ignore
                  `premium:${customerInfo?.metadata?.id}`,
                  JSON.stringify({
                    customer: customerInfo,
                    subscription: {
                      name: "Premium Pro",
                      isPremium: true,
                    },
                  }),
                  {
                    exat: new Date(new_premium_pro_expired).getTime() / 1000,
                  },
                )
                .catch(() => {
                  console.log("redis error");
                });
            }
          } else if (price?.id === process.env.ONETIME_PREMIUM_MAX_PRICE) {
            const customerInfo = await stripeClient.customers.retrieve(
              customer as string,
            );
            let old_premium_max_expired = new Date();
            if (
              // @ts-ignore
              customerInfo?.metadata?.premium_max_expired &&
              new Date() <
                // @ts-ignore
                new Date(customerInfo.metadata.premium_max_expired)
            ) {
              old_premium_max_expired = new Date(
                // @ts-ignore
                customerInfo.metadata.premium_max_expired,
              );
            }
            const new_premium_max_expired = new Date(
              old_premium_max_expired.setDate(
                old_premium_max_expired.getDate() + 31,
              ),
            ).toISOString();
            await stripeClient.customers.update(customer as string, {
              metadata: {
                // @ts-ignore
                ...(customerInfo?.metadata || {}),
                premium_max_expired: new_premium_max_expired,
              },
            });
            // @ts-ignore
            if (customerInfo?.metadata?.id) {
              await redisClient
                .set(
                  // @ts-ignore
                  `premium:${customerInfo?.metadata?.id}`,
                  JSON.stringify({
                    customer: customerInfo,
                    subscription: {
                      name: "Premium Max",
                      isPremium: true,
                    },
                  }),
                  {
                    exat: new Date(new_premium_max_expired).getTime() / 1000,
                  },
                )
                .catch(() => {
                  console.log("redis error");
                });
            }
          }
        }
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

export { POST };
