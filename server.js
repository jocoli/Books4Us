// Importing required libraries
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

// Create Express instance
const app = express();

// Define port
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());

app.use(express.json());

// Define home route
app.get('/', (req, res) => {
    res.send('Server home route');
});

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


// Listen on selected port
app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});