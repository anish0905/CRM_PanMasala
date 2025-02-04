const express = require('express');
const router = express.Router();
const { addInventory,dispatchStock,getInventoryByUserId,getAllInventory } = require('../../controllers/Inventory/subAdminInventoryController');

router.post('/add-inventory', addInventory);

router.post('/dispatch-inventory', dispatchStock);

router.get('/inventory/:userId', getInventoryByUserId);

router.get('/all-inventory', getAllInventory);

module.exports = router;
