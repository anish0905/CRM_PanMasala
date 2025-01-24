const express = require("express");
const { loginCNFAgent } = require("../../controllers/CNF_Agent/CNF_Agent.Controller"); 
const router = express.Router();

// Route for CNF Agent Login
router.post("/login", loginCNFAgent);

module.exports = router;
