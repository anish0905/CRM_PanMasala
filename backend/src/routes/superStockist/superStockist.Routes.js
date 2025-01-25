const express = require("express");

const router = express.Router();
const superStockistValidateToken = require("../../middleware/superStockistValidateTokenHandler");

const {
  registerUser,
  loginUser,
  currentUser,
  GetAllUser,
  updatePassword,
  deleteUser,
  updateUser,
  getUserByEmail,
  updateLocation,
} = require("../../controllers/superStockist/superStockistControllers");

//Register
router.post("/register", registerUser);

//Login

router.post("/login", loginUser);

//Current user information
//update password
router.put("/update-password/:id", updatePassword);

router.get("/current", superStockistValidateToken, currentUser);

router.get("/getAllUser", GetAllUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.post("/", getUserByEmail);

//update location

router.put("/update-location/:id", updateLocation);

// Current user information

module.exports = router;
