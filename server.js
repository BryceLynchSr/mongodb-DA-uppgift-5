const express = require('express');
const path = require('path');

const {MongoClient} = require('mongodb');

const app = express();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);



app.use(express.urlencoded({extended : true}));

let collection;
let collection2;

async function connect (){
    await client.connect();
    console.log("Ansluten till databasen");

    const db = client.db('mydb');
    collection = db.collection('customers');
    collection2 = db.collection('orders');

    console.log("Databas och två collections skapade");


    //await client.close();
}


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
    //let customerForm = document.getElementsByClassName('customer')
    const customer = req.body;
    await collection.insertOne(customer);
    res.redirect('customers');
})

app.post('/confirm', async (req, res) => {
    //let orderForm = document.getElementsByClassName('order-form');
    const order = req.body;
    await collection2.insertOne(order);
    res.redirect('orders');
})

app.get('/customers', async (req, res) => {
    const customer = await collection.find().toArray();
    const order = await collection2.find().toArray();
    res.json({customer, order}); 
})

app.get('/orders', async (req, res) => {
    const order = await collection2.find().toArray();
    const customer = await collection.find().toArray();
    res.json({order, customer});
})


app.listen(3000, async () => {
    await connect();
    console.log('http://localhost:3000');
})

