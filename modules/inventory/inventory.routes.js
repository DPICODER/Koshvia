const express = require('express');
const router = express.Router();
const authMiddleware = require('../../core/middleware/auth.middleware');
const InventoryController = require('./inventory.controller');

router.use(authMiddleware);

router.get('/',InventoryController.getInventory);

router.get('/history',InventoryController.getInvnetoryMovement);

router.get('/:id',InventoryController.getInventoryItem);

router.get('/history/:id',InventoryController.getInvnetoryMovementById);

router.post('/',InventoryController.addToInventory);

router.patch('/:id',InventoryController.updateEntry);

// router.patch('/items/:id/add-stock');
// router.patch('/items/:id/remove-stock');
// router.patch('/items/:id/adjust')
module.exports = router;