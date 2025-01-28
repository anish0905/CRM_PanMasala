const express = require("express");
const router = express.Router();
const {
  registersubAdmin,
  loginsubAdmin,
  currentUser,
  updatesubAdmin,
  getAllSubAdmin,
  deleteSubAdmin,
  cnfDetailsBySubAdmin,
} = require("../../controllers/subAdmin/subAdminController");
const validateToken = require("../../middleware/validateTokenHandler");

// Register
router.post("/register", registersubAdmin);

//Login
router.post("/login", loginsubAdmin);

//update password
router.put("/update/:id", updatesubAdmin);

//get all users
router.get("/users", getAllSubAdmin);

// Current user information

router.get("/current", validateToken, currentUser);

//delete user
router.get("/getAlluser/", getAllSubAdmin);

router.delete("/delete/:id", validateToken, deleteSubAdmin);

router.get("/cnf/:id", cnfDetailsBySubAdmin);

module.exports = router;
