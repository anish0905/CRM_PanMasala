const express = require("express");
const router = express.Router();
const {
  createDeliveryBoy,
  updateDeliveryBoy,
  deleteDeliveryBoy,
  getAllDelivery,
  getbyId,
  loginUser,
  getAllDeliveryBySuperStockistId
} = require("../../controllers/superStockist/superstockistDeliveryBoysController");

// Routes
router.post("/", createDeliveryBoy);
router.get("/",getAllDelivery) 
router.get("/:id",getbyId)
router.put("/:id", updateDeliveryBoy); 
router.delete("/:id", deleteDeliveryBoy); 
router.post("/login",loginUser)

router.get("/superstockist/:id", getAllDeliveryBySuperStockistId)  // get all delivery by super stockist id

module.exports = router;
