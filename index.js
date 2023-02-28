const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wynhew4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const serviceCollection = client.db("foodweb").collection("services");
    const reviewCollection = client.db("foodweb").collection("review");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/allServices", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.get("/currentUserReview", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });

    app.get("/review", async (req, res) => {
      const id = req.query.id;
      const query = { id: id };
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });

    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.put("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const review = req.body;
      const option = { upsert: true };
      const updateTask = {
        $set: {
          text: review.text,
        },
      };
      const result = await reviewCollection.updateOne(
        filter,
        updateTask,
        option
      );
      res.send(result);
    });

    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(filter);
      res.send(result);
    });

    app.get("/allServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
  }
  finally {

  }
}
run().catch(console.log);


app.get('/', async (req, res) => {
  res.send('foodweb server is running');
})

app.listen(port, () => console.log(`foodweb is running on ${port}`))