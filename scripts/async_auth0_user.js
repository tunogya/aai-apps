const {MongoClient, ServerApiVersion} = require('mongodb');
const dotenv = require('dotenv');
const {ManagementClient} = require("auth0");
dotenv.config();

const management = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', ''),
  clientId: process.env.AUTH0_M_CLIENT_ID,
  clientSecret: process.env.AUTH0_M_CLIENT_SECRET,
});

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
    
    await client.db("core").collection("auth0_users").createIndex({user_id: 1}, {unique: true})
    
    let page = 0;
    const per_page = 100;
    while (true) {
       management.users.getAll();
      const users = await management.users.getAll({
        page: page,
        per_page: per_page,
        sort: 'created_at:1',
      }).then((res) => res.status === 200 ? res.data : [])
      
      await client.db("core").collection("auth0_users").bulkWrite(
          users.map((user) => ({
            updateOne: {
              filter: {user_id: user.user_id},
              update: {
                $set: user
              },
              upsert: true
            }
          }))
      )
      console.log("Insert auth0_users success! page: ", page)
      
      if (users.length < per_page) {
        console.log("Finish insert auth0_users!")
        break
      }
      
      page += 1
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
