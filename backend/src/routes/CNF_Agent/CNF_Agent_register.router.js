const express = require("express");
const { registerCNFAgent } = require("../../controllers/CNF_Agent/CNF_Agent_Register.controller"); // Adjust the path as needed
const router = express.Router();

// Route for registering a CNF Agent
router.post("/register", registerCNFAgent);

module.exports = router;
