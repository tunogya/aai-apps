import { NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/app/utils/stripeClient";
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
      const {
        id,
        customer_email,
        customer: customerId,
        amount_subtotal,
        currency,
      } = checkoutSessionCompleted;
      let customer;
      if (customer_email) {
        const customers = await stripeClient.customers.list({
          email: customer_email,
        });
        customer = customers?.data?.[0] as Stripe.Customer;
      }
      if (customerId) {
        customer = await stripeClient.customers.retrieve(customerId as string);
      }
      if (customer) {
        const lineItems =
          await stripeClient.checkout.sessions.listLineItems(id);
        for (const lineItem of lineItems.data) {
          const { price } = lineItem;
          if (
            price?.id === process.env.NEXT_PUBLIC_AAI_CREDIT_PRICE &&
            currency &&
            amount_subtotal
          ) {
            await stripeClient.customers.createBalanceTransaction(customer.id, {
              amount: -1 * amount_subtotal,
              currency: currency,
              description: "Buy AAI credit",
            });
          }
        }
      } else {
        return NextResponse.json(
          { message: "404 customer not found" },
          { status: 200 },
        );
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
