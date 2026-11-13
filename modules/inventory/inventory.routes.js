const express = require('express');
const router = express.Router();
const authMiddleware = require('../../core/middleware/auth.middleware');
const InventoryController = require('./inventory.controller');
const {validateInventoryCreate, validateAddStock, validateReduceStock} = require('../../core/utils/validators/inventory.validator');
const validator = require('../../core/middleware/validate.middleware');
router.use(authMiddleware);

router.get('/',InventoryController.getInventory);

router.get('/history',InventoryController.getInvnetoryMovement);

router.get('/:id',InventoryController.getInventoryItem);

router.get('/history/:id',InventoryController.getInvnetoryMovementById);

router.post('/',validator(validateInventoryCreate),InventoryController.addToInventory);

router.patch('/:id',InventoryController.updateEntry);


router.patch('/items/:id/add-stock',validator(validateAddStock),InventoryController.addStock);
router.patch('/items/:id/remove-stock',validator(validateReduceStock),InventoryController.reduceStock);
// router.patch('/items/:id/adjust')
module.exports = router;
