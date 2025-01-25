const express = require('express');
const { getAllInventoryByUserId, getHistroyByInventorId, addInventory,dispatchInventory } = require('../../controllers/superStockist/SuperStockistInventoryController');

const router = express.Router();

router.post('/dispatch', dispatchInventory);
router.post('/addInventory', addInventory);


 router.get('/histroy/:id', getHistroyByInventorId);
   
 router.get('/:id', getAllInventoryByUserId);




module.exports = router;
