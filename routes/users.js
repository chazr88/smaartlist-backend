const express = require('express');
const userController = require('./userController');

const app = express();

// Set up routes
app.get('/users', userController.getAllUsers);
app.get('/users/:id', userController.getUserById);

// Other routes...

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});