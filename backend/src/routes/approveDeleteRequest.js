const express = require("express");
const router = express.Router();
const {
  approveFieldDeleteRequest,
  getApprovedFieldManager,
} = require("../controllers/ApproveDeleteRequest/approveDeleteRequest");

router.delete(
  "/field-manager/delete-request/approve",
  approveFieldDeleteRequest
);

router.get("/approvedFieldManagers", getApprovedFieldManager);
module.exports = router;
