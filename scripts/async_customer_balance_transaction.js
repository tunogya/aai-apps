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
    
    const findResult = await client.db('core').collection('stripe_customers').find()
    
    for await (const doc of findResult) {
      await asyncCBTXN(doc.id)
    }
  } finally {
    await client.close()
  }
}

async function asyncCBTXN(customerId) {
  let starting_after = undefined;
  
  while (true) {
    const txns = await stripeClient.customers.listBalanceTransactions(customerId, {
      starting_after: starting_after,
      limit: 100,
    })
    
    if (txns.data.length === 0) break
    
    for (let i = 0; i < txns.data.length; i++) {
      const txn = txns.data[i];
      const result = await client.db('core').collection('customer_balance_transaction').findOne({
        txn: txn.id
      })
      if (result) {
        console.log("Has been inserted, skip", txn.id)
      } else {
        await client.db('core').collection('customer_balance_transaction').insertOne({
          amount: txn.amount / 100,
          timestamp: new Date(txn.created * 1000),
          metadata: {
            customer: txn.customer.id,
          },
          txn: txn.id
        })
        console.log("Insert success", txn.id)
      }
    }
    
    
    console.log("Insert customer_balance_transaction success! starting_after: ", starting_after, customerId)
    
    starting_after = txns.data[txns.data.length - 1].id
    
    if (txns.data.length < 100) break
  }
}

run().catch(console.dir);
