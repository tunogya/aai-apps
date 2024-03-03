import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import Stripe from "stripe";
import { ManagementClient } from "auth0";
import { MongoClient, ServerApiVersion } from "mongodb";

const management = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL!.replace("https://", ""),
  clientId: process.env.AUTH0_M_CLIENT_ID!,
  clientSecret: process.env.AUTH0_M_CLIENT_SECRET!,
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

    let page = 0;
    const per_page = 100;
    while (true) {
      const users = await management.users
        .getAll({
          page: page,
          per_page: per_page,
          sort: "created_at:1",
        })
        .then((res) => (res.status === 200 ? res.data : []));

      await client
        .db("core")
        .collection("auth0_users")
        .bulkWrite(
          users.map((user: any) => ({
            updateOne: {
              filter: { _id: user.user_id },
              update: {
                $set: {
                  ...user,
                  _id: user.user_id,
                },
              },
              upsert: true,
            },
          })),
        );
      console.log("Insert auth0_users success! page: ", page);

      if (users.length < per_page) {
        console.log("Finish insert auth0_users!");
        break;
      }

      page += 1;
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