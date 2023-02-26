const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wynhew4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db("foodweb").collection("services");  

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
    }
    finally{

    }
}
run().catch(console.log);


app.get('/',async(req, res) =>{
    res.send('foodweb server is running');
})

app.listen(port, () => console.log(`foodweb is running on ${port}`))