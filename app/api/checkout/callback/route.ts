import { NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/utils/stripeClient";

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
        const customer_id = (customer as Stripe.Customer).id;
        const lineItems =
          await stripeClient.checkout.sessions.listLineItems(id);
        for (const lineItem of lineItems.data) {
          const { price, amount_subtotal } = lineItem;
          if (price?.id === "price_1NtMGxFPpv8QfieYD2d3FSwe") {
            await stripeClient.customers.createBalanceTransaction(customer_id, {
              amount: -1 * amount_subtotal,
              currency: "usd",
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
