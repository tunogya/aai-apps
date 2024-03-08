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
    
    const findResult = await client.db('core').collection('stripe_customers').find({
      balance: {
        $gt: 0
      }
    })
    
    for await (const doc of findResult) {
      await stripeClient.customers.createBalanceTransaction(doc._id, {
        amount: -1 * doc.balance,
        currency: "usd",
        description: 'System Clearing',
      })
      console.log("Clearing customer balance success! id: ", doc.email);
    }
  } catch (e) {
  
  } finally {
    await client.close()
  }
}

run().catch(console.dir);
