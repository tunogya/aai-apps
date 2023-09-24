import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/utils/stripeClient";
import sqsClient from "@/utils/sqsClient";
import { SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import redisClient from "@/utils/redisClient";

const POST = async (req: NextRequest) => {
  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  let event: Stripe.Event;
  console.log("sig", sig);
  if (!sig) {
    console.log("No signature provided");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 500 },
    );
  }

  try {
    event = stripeClient.webhooks.constructEvent(payload, sig, webhookSecret);
    console.log("event:", event);
    if (event.type === "checkout.session.completed") {
      const checkoutSessionCompleted = event.data
        .object as Stripe.Checkout.Session;
      const {
        id,
        created,
        payment_intent,
        metadata,
        payment_status,
        amount_subtotal, // 100 decimal
        currency,
      } = checkoutSessionCompleted;
      const item = await redisClient.get(id);
      if (
        item === "price_1NtMGxFPpv8QfieYD2d3FSwe" &&
        payment_status === "paid" &&
        currency === "usd" &&
        metadata?.id &&
        amount_subtotal
      ) {
        await sqsClient.send(
          new SendMessageBatchCommand({
            QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
            Entries: [
              {
                Id: `update-balance#${payment_intent}`,
                MessageBody: JSON.stringify({
                  TableName: "abandonai-prod",
                  Key: {
                    PK: `USER#${metadata.id}`,
                    SK: `BALANCE`,
                  },
                  UpdateExpression: `ADD #balance :add_credit`,
                  ExpressionAttributeNames: {
                    "#balance": "balance",
                  },
                  ExpressionAttributeValues: {
                    ":add_credit": amount_subtotal / 100,
                  },
                }),
                MessageAttributes: {
                  Command: {
                    DataType: "String",
                    StringValue: "UpdateCommand",
                  },
                },
                MessageGroupId: "update-balance",
              },
              {
                Id: `update-payment#${payment_intent}`,
                MessageBody: JSON.stringify({
                  TableName: "abandonai-prod",
                  Item: {
                    PK: `USER#${metadata.id}`,
                    SK: `PAYMENT#${created}`,
                    ...checkoutSessionCompleted,
                  },
                }),
                MessageAttributes: {
                  Command: {
                    DataType: "String",
                    StringValue: "PutCommand",
                  },
                },
                MessageGroupId: "update-payment",
              },
            ],
          }),
        );
      }
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.log("error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export { POST };
