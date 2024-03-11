const {MongoClient, ServerApiVersion} = require('mongodb');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    let starting_after = undefined;
    const limit = 100;
    
    await client.db("core").collection("stripe_customers").createIndex({id: 1}, {unique: true})
    
    while (true) {
      const customers = await stripeClient.customers.list({
        limit: limit,
        starting_after: starting_after
      })
      
      await client.db("core").collection("stripe_customers").bulkWrite(
          customers.data.map((customer) => ({
            updateOne: {
              filter: {id: customer.id},
              update: {
                $set: customer
              },
              upsert: true
            }
          }))
      )
      
      console.log("Insert auth0_users success! starting_after: ", starting_after)
      
      if (customers.has_more) {
        starting_after = customers.data[customers.data.length - 1].id
      } else {
        console.log("All done!")
        break
      }
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
