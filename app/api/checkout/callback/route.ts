import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/utils/stripeClient";

const POST = async (req: NextRequest) => {
  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  if (!sig) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 500 },
    );
  }

  try {
    event = stripeClient.webhooks.constructEvent(payload, sig, webhookSecret);
    if (event.type === "checkout.session.completed") {
      const checkoutSessionCompleted = event.data
        .object as Stripe.Checkout.Session;
      const {
        metadata,
        payment_status,
        amount_subtotal,
        currency,
        client_reference_id,
        invoice,
      } = checkoutSessionCompleted;
      if (payment_status === "paid" && currency === "USD") {
        // TODO, update user Balance
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export { POST };
