const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  currentUser,
  updateAdministratorDetails,
  getAllAdministrators,
  deleteAdministrator,
} = require("../controllers/adminController");
const validateToken = require("../middleware/validateTokenHandler");

const { deleteUser }  = require("../controllers/CNF_AgentController");
const { deleteSubAdmin }  = require("../controllers/subAdmin/subAdminController");

// Register
router.post("/register", registerUser);

//Login
router.post("/login", loginUser);

//update password
router.put("/update/:id", updateAdministratorDetails);

//get all users
router.get("/users", getAllAdministrators);

// Current user information

router.get("/current", validateToken, currentUser);

//delete user

router.delete("/delete/:id", validateToken, deleteAdministrator);

//delete user

router.delete("/cnf/delete/:id", validateToken, deleteUser);

//delete user

router.delete("/subAdmin/delete/:id", validateToken, deleteSubAdmin);


module.exports = router;
