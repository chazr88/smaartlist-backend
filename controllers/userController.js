// Import necessary dependencies
const db = require('./db'); // Import your db.js file

// Define your user controller methods
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await db.query('SELECT * FROM users');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      if (user.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(user[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Other user controller methods...
};

module.exports = userController;