const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const req = require('express/lib/request');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 8888;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o6whk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()
        const database = client.db('foot-shoes')
        const shoesCollection = database.collection('shoes')
        const ShoesCartColection = database.collection('cart')
        const WishListCollection = database.collection('wishlist')

        app.get('/products', async (req, res) => {
            const size = parseInt(req.query.size);
            const cursor = shoesCollection.find({});
            let product;
            if (size) {
                product = await cursor.limit(size).toArray();
            }
            else {
                product = await cursor.toArray();
            }
            res.json(product)
        })
        app.post('/cart', async (req, res) => {
            let productCart = req.body;
            let result = await ShoesCartColection.insertOne(productCart);
            res.json(result)
        })
        app.post('/wishlist', async (req, res) => {
            let productWish = req.body;
            let result = await WishListCollection.insertOne(productWish)
            res.json(result)
        })
        app.get('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await shoesCollection.findOne(query);
            res.json(result)
        })

    }
    finally {

    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('api calld')
})

app.listen(port, () => {
    console.log('start server', port);
})