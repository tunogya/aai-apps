import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient, ServerApiVersion } from "mongodb";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const uri = process.env.MONGODB_URI!;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const GET = async (req: NextRequest) => {
  try {
    await client.connect();

    let starting_after = undefined;
    const limit = 100;

    while (true) {
      const customers: any = await stripeClient.customers.list({
        limit: limit,
        starting_after: starting_after,
      });

      await client
        .db("core")
        .collection("stripe_customers")
        .bulkWrite(
          customers.data.map((customer: any) => ({
            updateOne: {
              filter: { _id: customer.id },
              update: {
                $set: {
                  ...customer,
                  _id: customer.id,
                },
              },
              upsert: true,
            },
          })),
        );

      console.log(
        "Insert auth0_users success! starting_after: ",
        starting_after,
      );

      if (customers.has_more) {
        starting_after = customers.data[customers.data.length - 1].id;
      } else {
        console.log("All done!");
        break;
      }
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return NextResponse.json({
    ok: true,
  });
};

export { GET };
