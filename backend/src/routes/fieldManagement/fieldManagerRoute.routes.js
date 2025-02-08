const express = require("express");
const router = express.Router();
const FieldManagerController = require("../../controllers/FieldManagement/LoginController.controller.js");

// Get all FieldManagers
router.post("/register", FieldManagerController.registerFieldManager);
router.post("/login", FieldManagerController.login);
router.get("/getFieldManager", FieldManagerController.getFieldManager);
router.get(
  "/getFieldManager/:id",
  FieldManagerController.getFieldManagerbYfeaid
);

router.put("/update/:id", FieldManagerController.updateFieldManager);
router.get("/getFieldManager/:id", FieldManagerController.getByIdFieldManager);
router.delete(
  "/requestDeleteByIdFieldManager/delete/:id",
  FieldManagerController.requestDeleteByIdFieldManager
);

router.post("/logout/:id", FieldManagerController.logout);

module.exports = router;
