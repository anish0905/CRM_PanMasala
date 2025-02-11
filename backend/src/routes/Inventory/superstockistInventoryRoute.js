const express = require('express');
const router = express.Router();
const { addInventory,dispatchStock,getInventoryByUserId,getSuperInventoryByCnfId } = require('../../controllers/Inventory/superstcokistInventoryController');

router.post('/add-inventory', addInventory);

router.post('/dispatch-inventory', dispatchStock);

router.get('/inventory/:userId', getInventoryByUserId);

router.get('/super-inventory/:cnfId', getSuperInventoryByCnfId);




module.exports = router;