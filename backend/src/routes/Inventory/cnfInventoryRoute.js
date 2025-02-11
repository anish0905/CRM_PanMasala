const express = require('express');
const router = express.Router();
const { addInventory,dispatchStock,getInventoryByUserId,getAllInventoryData } = require('../../controllers/Inventory/cnfInventoryController');

router.post('/add-inventory', addInventory);

router.post('/dispatch-inventory', dispatchStock);

router.get('/inventory/:userId', getInventoryByUserId);

router.get('/all-inventory', getAllInventoryData);



module.exports = router;