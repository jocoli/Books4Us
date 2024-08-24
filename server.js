// Importing required libraries
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Create Express instance
const app = express();

// Define port
const port = process.env.PORT || 3001;

// MongoDB
const uri = "redacted";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
await client.connect();

// Connect to MongoDB
async function connectToMongoDB(){
    try{
        await client.connect();
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToMongoDB();

// Middleware
app.use(cors());

app.use(express.json());

// Define home route
app.get('/', (req, res) => {
    res.send('Server home route');
});

// Route to fetch api books. Gets 10 books max.
app.get('/api/books', async (req, res) => {
    const query = req.query.q;
    const startIndex = req.query.startIndex || 0; // Get startIndex from query params, default to 0
    const maxResults = req.query.maxResults || 10; // Get maxResults from query params, default to 10

    if (!query) {
        return res.status(400).send('Query is required');
    }

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        res.status(500).send('Error fetching data from Google Books API');
    }
});

// Route to fetch book details by ID
app.get('/api/book/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) {
            return res.status(404).send('Book not found');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        res.status(500).send('Error fetching data from Google Books API');
    }
});

// Route to fetch saved books
app.get('/api/saved-books', async (req, res) => {
    try {
        const db = await client.db("SavedBooks");
        const collection = db.collection("bookCollection");
        const savedBooks = await collection.find({}).toArray();
        res.json(savedBooks);
    }
    catch(error){
        console.error('Error fetching saved books from MongoDB', error);
        res.status(500).send('Error fetching saved books from MongoDB');
    }
})

// Add book to SavedBooks database
app.post('/api/books', async (req,res) => {
    const book = req.body;

    try {
        const db = client.db("SavedBooks");
        const collection = db.collection("bookCollection");
        const result = await collection.insertOne(book);
        console.log(`Book added with ID: ${result.insertedId}`);
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertedId });
    } catch (error) {
        console.error('Error adding book to MongoDB:', error);
        res.status(500).send('Error adding book to MongoDB');
    }
})

// Close MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});


// Listen on selected port
app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});
