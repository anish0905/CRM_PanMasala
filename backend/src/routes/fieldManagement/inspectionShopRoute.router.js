const express = require("express");
const router = express.Router();
const inspectionShopController = require("../../controllers/FieldManagement/inspectionShopController.controller.js");

// POST request to create inspection shop details
router.post("/create", inspectionShopController.createInspectionShop);
router.get("/getinspection/shop", inspectionShopController.getInspectionShop);
router.get(
  "/getinspection/shop/:id",
  inspectionShopController.getInspectionShopByFEAId
);
router.get(
  "/feildManagerId/:id",
  inspectionShopController.getInspectionShopByfieldManagerId
);

router.get("/shop-location/:id", inspectionShopController.getShopLocationById);
router.put(
  "/update/inspections/:id",
  inspectionShopController.updateInspectionShop
);

router.delete("/delete/:id", inspectionShopController.deleteInspectionShop);
router.put("/status/:id", inspectionShopController.updateStatus);

router.get(
  "/executiveId/:executiveId",
  inspectionShopController.getAllByExecutivebyid
);

router.get(
  "/averageRatingproducts",
  inspectionShopController.ProductAvrageRating
);

router.get(
  "/history/:recordId",
  inspectionShopController.getHistoryWithUserDetails
);

module.exports = router;
