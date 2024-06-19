const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q9eobgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const userCollection = client.db('SociiNetDB').collection('Users');
        const postCollection = client.db('SociiNetDB').collection('contents');
        const CommentCollection = client.db('SociiNetDB').collection('comments');

        // post
        app.get('/allPost', async (req, res) => {
            const result = await postCollection.find().toArray()
            res.send(result)
        })


        app.post('/newPost', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post)
            res.send(result)
        })
        app.delete('/deletePost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await postCollection.deleteOne(query)
            res.send(result)
        })
        // comment
        app.get('/Comment/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { contentId: id }
            const result = await CommentCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/newComment', async (req, res) => {
            const comment = req.body;
            const result = await CommentCollection.insertOne(comment)
            res.send(result)
        })
        // user
        app.post('/createUser', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.patch('/user/:email', async (req, res) => {
            const email = req.params.email;
            const password = req.body;
            console.log(password);
            const query = { email: email }
            const updateUser = {
                $set: {
                    password: password
                }
            }
            const result = await userCollection.updateOne(query, updateUser)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('SociiNet is running')
})

app.listen(port, () => {
    console.log(`SociiNet server is running on port: ${port}`);
})