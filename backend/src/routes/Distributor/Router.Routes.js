const express = require('express');
const router = express.Router();
const mongoose=require("mongoose")
const {
  getDistributorOrders,
  createDistributorOrder,
  getDistributorOrder,
  updateDistributorOrder,
  deleteDistributorOrder,
  currentUser,
  updateDistributorOrderStatus
} = require('../../controllers/Distributor/DistributorOrder.Controller'); // Ensure the correct path to your controller
const executiveValidateToken = require("../../middleware/executiveValidateTokenHandler");
const DistributorOrder = require("../../models/Distributor/DistributorOrder.Model");
const asyncHandler = require("express-async-handler");






// Define routes for CRUD operations on Distributor Orders

// router.route('/current').get(currentUser)
router.get("/current",executiveValidateToken,currentUser)
router.route('/')

  .get(getDistributorOrders)
  // Get all Distributor orders for the current user
  // .post(createDistributorOrder)
  router.post("/",executiveValidateToken,createDistributorOrder)
  ; // Create a new Distributor order

  router.delete("/:id", executiveValidateToken, deleteDistributorOrder);
  // Delete a specific Distributor order by ID


  // Get a single Distributor order by ID
router.route('/:id').get(asyncHandler(async (req, res) => {
  try {
    // Ensure the ID is a valid ObjectId
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      // If ID is invalid, return a 400 error with a clear message
      res.status(400).json({ error: "Invalid order ID format." });
      return;
    }

    // Find the Distributor order by ID
    const order = await DistributorOrder.findById(orderId);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching Distributor order:", error);
    res.status(500).json({ error: "An error occurred while fetching the order." });
  }
}));



  // PUT a single Distributor order by ID
 // Middleware to validate ObjectId
 const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid order ID format." });
    return;
  }
  next();
};

router.put("/:id", executiveValidateToken, validateObjectId, asyncHandler(updateDistributorOrder));

// router.route('/:id').put(executiveValidateToken, asyncHandler(updateDistributorOrder))
  

module.exports = router;