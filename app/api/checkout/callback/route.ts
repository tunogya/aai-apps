import { NextResponse } from "next/server";
import Stripe from "stripe";
import stripeClient from "@/utils/stripeClient";
import sqsClient from "@/utils/sqsClient";
import { SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import redisClient from "@/utils/redisClient";

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
        payment_intent,
        created,
        metadata,
        amount_subtotal, // 100 decimal
        currency,
      } = checkoutSessionCompleted;
      const item = await redisClient.get(id);
      if (
        item === "price_1NtMGxFPpv8QfieYD2d3FSwe" &&
        currency === "usd" &&
        metadata?.id &&
        amount_subtotal
      ) {
        await sqsClient.send(
          new SendMessageBatchCommand({
            QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
            Entries: [
              {
                Id: `update-balance-${payment_intent}`,
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
                Id: `update-payment-${payment_intent}`,
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
        await redisClient.del(id);
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
