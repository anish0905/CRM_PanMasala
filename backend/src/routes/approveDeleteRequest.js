const express = require("express");
const router = express.Router();
const {
  approveFieldDeleteRequest,
  getApprovedFieldManager,
  approveDistributorDeleteRequest,
  // getApprovedDistributor,
} = require("../controllers/ApproveDeleteRequest/approveDeleteRequest");

//Status
router.get("/:id", getApprovedFieldManager);

//field manager approvel
router.delete(
  "/field-manager/delete-request/approve",
  approveFieldDeleteRequest
);

router.get("/approvedFieldManagers", getApprovedFieldManager);

// router.get("/approvedFieldManagers/distributor", getApprovedDistributor);

//distributor approvel

module.exports = router;
