const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port =process.env.PORT || 5000;

// middle ware
app.use(cors())
app.use(express.json());

// connection setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l1qze.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run(){
    try{
        await client.connect();
        // console.log("database connected");
        const database = client.db('travelService');
        const servicesCollection = database.collection('services');
        // get api
        app.get('/services',async (req,res)=>{
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        });
        // get single service
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });


      //   post api
        app.post('/services', async(req,res)=>{
            const service = req.body;
            console.log('hit the api',service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
      });

    //   delete 
    app.delete('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
    })
    }
    finally{
        // await client.close();

    }
}
run().catch(console.dir);


app.get('/',(req ,res)=>{
     res.send('Traveling Service is running');
 });
app.listen(port ,(req,res)=>{
    console.log('Running Server is',port);
}) 


