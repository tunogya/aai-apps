import { NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/app/utils/stripeClient";

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
          if (price?.id === "price_1OMrgVFPpv8QfieYVVAnoRJt") {
            const customerInfo = await stripeClient.customers.retrieve(
              customer as string,
            );
            // @ts-ignore
            const premium_standard_expired = customerInfo?.metadata
              ?.premium_standard_expired
              ? new Date(
                  // @ts-ignore
                  customerInfo?.metadata?.premium_standard_expired,
                ).toISOString()
              : new Date().toISOString();
            const new_premium_standard_expired = new Date(
              premium_standard_expired,
            ).setDate(new Date(premium_standard_expired).getDate() + 31);
            await stripeClient.customers.update(customer as string, {
              metadata: {
                // @ts-ignore
                ...(customerInfo?.metadata || {}),
                premium_standard_expired: new Date(
                  new_premium_standard_expired,
                ).toISOString(),
              },
            });
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
