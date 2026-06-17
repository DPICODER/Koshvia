const express = require('express');
const authMiddleware = require('../../core/middleware/auth.middleware');
const { getInventory, addToInventory, updateEntry, getInventoryItem } = require('./inventory.controller');
const router = express.Router();

router.use(authMiddleware);

router.get('/',getInventory);

router.get('/:id',getInventoryItem);

router.post('/',addToInventory);

router.patch('/:id',updateEntry);

// router.delete('/:id',removeEntry);

module.exports=router;