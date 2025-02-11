const express = require('express');
const router = express.Router();
const { addInventory,dispatchStock,getInventoryByUserId,sendRequiredForInventory,getSuperInventoryBySuperstockistId } = require('../../controllers/Inventory/distributoryInventoryContoller');

router.post('/add-inventory', addInventory);

router.post('/dispatch-inventory', dispatchStock);

router.get('/inventory/:userId', getInventoryByUserId);

router.post('/send-required-for-inventory', sendRequiredForInventory);

router.get('/super-inventory/:superstockistId', getSuperInventoryBySuperstockistId);







module.exports = router;
