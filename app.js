const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const createSchema = require('./config/schema');
const listRoutes = require('./routes/listsRoutes.js');

const app = express();

// Call the createSchema function to create the schema
createSchema();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse request bodies as JSON
app.use(express.json());

// Set up routes
app.use('/lists', listRoutes);

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
