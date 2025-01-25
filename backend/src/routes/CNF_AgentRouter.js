const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    currentUser,
    updateUserDetails,
    getAllUsers,
    deleteUser,
} = require("../controllers/CNF_AgentController");
const validateToken = require("../middleware/validateTokenHandler");

// Register
router.post("/register", registerUser);

//Login
router.post("/login", loginUser);

//update password
router.put("/update/:id", updateUserDetails);

//get all users
router.get("/users", getAllUsers);

// Current user information

router.get("/current", validateToken, currentUser);

//delete user

router.delete("/:id", validateToken, deleteUser);

module.exports = router;
