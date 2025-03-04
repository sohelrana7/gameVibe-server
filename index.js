require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(express.json());
app.use(cors());

// gameVibe
// nGr1DicH5MY2vDyE

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7heaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const reviewCollection = client.db("gameDB").collection("reviews");
    const watchListCollection = client.db("gameDB").collection("watchList");

    // watch List related api
    app.get("/watchLists", async (req, res) => {
      const cursor = watchListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/watchLists", async (req, res) => {
      const watchList = req.body;
      // console.log(watchList);
      const result = await watchListCollection.insertOne(watchList);
      res.send(result);
    });
    // review related api
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      console.log(newReview);
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to gameVibe server!");
});

app.listen(port, () => {
  console.log(`GameVibe server is running on: ${port}`);
});
