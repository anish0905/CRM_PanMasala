const express = require('express');
const { getAllInventoryByUserId,
    getHistoryByInventoryId,
    addInventory,
    dispatchInventory,} = require('../../controllers/Distributor/DistributorInventory.Controller');

const router = express.Router();

router.post('/dispatch', dispatchInventory);
router.post('/addInventory', addInventory);


 router.get('/histroy/:id', getHistoryByInventoryId);
   
 router.get('/:id', getAllInventoryByUserId);




module.exports = router;
