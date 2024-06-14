const pool = require("../config/db");

const listController = {
  getAllLists: async (req, res) => {
    try {
      const client = await pool.connect();

      // Perform database query to get all lists
      const query = `
        SELECT * FROM my_schema.lists
      `;
      const result = await client.query(query);
      const lists = result.rows;

      client.release();

      // Send the response with the lists
      res.status(200).json(lists);
    } catch (error) {
      console.error("Error getting lists:", error);
      res.status(500).json({ message: "Error getting lists" });
    }
  },

  getListById: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await pool.connect();

      const query = `
        SELECT * FROM my_schema.lists WHERE id = $1
      `;
      const values = [id];
      const result = await client.query(query, values);
      const list = result.rows[0];

      client.release();

      if (!list) {
        return res.status(404).json({ message: "No list found with the given id" });
      }

      res.status(200).json(list);
    } catch (error) {
      console.error("Error getting list by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createList: async (req, res) => {
    try {
      const { name } = req.body;
  
      const client = await pool.connect();
  
      // Start a transaction
      await client.query('BEGIN');
  
      // Update the old active list
      const deactivateQuery = `
        UPDATE my_schema.lists 
        SET active = false 
        WHERE active = true
      `;
      await client.query(deactivateQuery);
  
      // Insert the new active list
      const insertQuery = `
        INSERT INTO my_schema.lists (name, active)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [name, true];
      const result = await client.query(insertQuery, values);
  
      // Commit the transaction
      await client.query('COMMIT');
  
      client.release();
  
      const newList = result.rows[0];
  
      res.status(201).json(newList);
    } catch (error) {
      // Roll back the transaction in case of any errors
      await client.query('ROLLBACK');
      client.release();
      console.error("Error creating list:", error);
      res.status(500).json({ message: "Error creating list" });
    }
  },

  getActiveList: async (req, res) => {
    let client;
    try {
      client = await pool.connect();

      const query = `
        SELECT * FROM my_schema.lists WHERE active = true;
      `;
      const result = await client.query(query);
      const activeList = result.rows[0];

      if (!activeList) {
        return res.status(404).json({ message: "No active list found" });
      }

      res.status(200).json(activeList);
    } catch (error) {
      console.error("Error fetching active list:", error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  updateList: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, active } = req.body;
    
      const client = await pool.connect();
    
      // Find the list by id
      const selectQuery = `
        SELECT * FROM my_schema.lists
        WHERE id = $1
      `;
      const selectValues = [id];
      const selectResult = await client.query(selectQuery, selectValues);
      const list = selectResult.rows[0];
    
      if (!list) {
        client.release();
        return res.status(404).json({ message: "List not found" });
      }
    
      // Construct the update query based on the fields provided
      let updateQuery = 'UPDATE my_schema.lists SET ';
      let updateValues = [];
      let count = 1;
  
      if (name !== undefined) {
        updateQuery += `name = $${count}, `;
        updateValues.push(name);
        count++;
      }
      if (active !== undefined) {
        updateQuery += `active = $${count} `;
        updateValues.push(active);
        count++;
      }
    
      updateQuery += `WHERE id = $${count} RETURNING *`;
      updateValues.push(id);
    
      const updateResult = await client.query(updateQuery, updateValues);
      const updatedList = updateResult.rows[0];
    
      client.release();
    
      res.status(200).json(updatedList);
    } catch (error) {
      console.error("Error updating list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  
  deleteList: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await pool.connect();

      const query = `
        DELETE FROM my_schema.lists WHERE id = $1
      `;
      const values = [id];
      await client.query(query, values);

      client.release();

      res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
      console.error("Error deleting list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addItemToList: async (req, res) => {
    try {
      const { listId } = req.params;
      const { name, amount, measurement } = req.body;

      const client = await pool.connect();

      const query = `
        INSERT INTO my_schema.items (list_id, name, amount, measurement)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [listId, name, amount, measurement];
      const result = await client.query(query, values);
      const newItem = result.rows[0];

      client.release();

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding item to list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateItemInList: async (req, res) => {
    try {
      const { listId, itemId } = req.params;
      const { name, amount, measurement } = req.body;

      const client = await pool.connect();

      const query = `
        UPDATE my_schema.items
        SET name = $1, amount = $2, measurement = $3
        WHERE list_id = $4 AND id = $5
        RETURNING *
      `;
      const values = [name, amount, measurement, listId, itemId];
      const result = await client.query(query, values);
      const updatedItem = result.rows[0];

      client.release();

      if (!updatedItem) {
        return res.status(404).json({ message: "No item found with the given id in this list to update" });
      }

      res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating item in list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllItemsFromList: async (req, res) => {
    try {
      const { listId } = req.params;

      const client = await pool.connect();

      const query = `
        SELECT * FROM my_schema.items WHERE list_id = $1
      `;
      const values = [listId];
      const result = await client.query(query, values);
      const items = result.rows;

      client.release();

      res.status(200).json(items);
    } catch (error) {
      console.error("Error getting items from list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getItemFromList: async (req, res) => {
    try {
      const { listId, itemId } = req.params;

      const client = await pool.connect();

      const query = `
        SELECT * FROM my_schema.items WHERE list_id = $1 AND id = $2
      `;
      const values = [listId, itemId];
      const result = await client.query(query, values);
      const item = result.rows[0];

      client.release();

      if (!item) {
        return res.status(404).json({ message: "No item found with the given id in this list" });
      }

      res.status(200).json(item);
    } catch (error) {
      console.error("Error getting item from list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteItemFromList: async (req, res) => {
    try {
      const { listId, itemId } = req.params;

      const client = await pool.connect();

      const query = `
        DELETE FROM my_schema.items
        WHERE list_id = $1 AND id = $2
      `;
      const values = [listId, itemId];
      await client.query(query, values);

      client.release();

      res.status(200).json({ message: "Item deleted successfully from the list" });
    } catch (error) {
      console.error("Error deleting item from list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = listController;
