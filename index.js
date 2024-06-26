const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//coffeeMaster
//ctvyY4BjONp0cJ34
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyebw6d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("user");


    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/updatecoffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatecoffee = req.body;
      const coffee = {
        $set: {
          name: updatecoffee.name,
          chef: updatecoffee.chef,
          taste: updatecoffee.taste,
          category: updatecoffee.category,
          details: updatecoffee.details,
          photo: updatecoffee.photo,
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      console.log(result);
      res.send(result);
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    app.patch('/user' , async(req,res) => {
      const user = req.body;
      const filter = {email : user.email}
      const updateDoc ={
        $set:{
          lastLoggedAt:user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter , updateDoc);
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//midlleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  console.log("Coffee Server is Running");
  res.send('hello')
})

app.listen(port, () => {
  console.log(`Coffee Server is running on Port : ${port}`);
})