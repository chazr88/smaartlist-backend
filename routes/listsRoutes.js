const express = require('express');
const listController = require('../controllers/listController');

const router = express.Router();


// Get all lists
router.get('/', listController.getAllLists);

// Create a new list
router.post('/', listController.createList);

//Get last list created
router.get('/active', listController.getActiveList);

// Get a specific list by id
router.get('/:id', listController.getListById);

// Update an existing list
router.put('/:id', listController.updateList);

// Delete a list
router.delete('/:id', listController.deleteList);

// Add an item to a list
router.post('/:listId/items', listController.addItemToList);

// Update an item in a list
router.get('/:listId/items', listController.getAllItemsFromList);

// Update an item in a list
router.put('/:listId/items/:itemId', listController.updateItemInList);

// Delete an item from a list
router.delete('/:listId/items/:itemId', listController.deleteItemFromList);

module.exports = router;
