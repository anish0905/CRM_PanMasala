const express = require ("express");
const router = express.Router();
const {registerUser,loginUser,currentUser, getStateCity,GetAllUser,getUserDetailsByEmail, getDistributorBySuperByID,updateUser,deleteUser}= require("../../controllers/Distributor/Distributor.Controller");
const executiveValidateToken = require("../../middleware/executiveValidateTokenHandler");


//Register
router.post("/registerDistributor",registerUser);

//Login

router.post("/loginexDistributor",loginUser);

router.post("/email",getUserDetailsByEmail)

router.put("/update/:id", updateUser)

router.delete("/:id", deleteUser)

//Current user information

router.get("/currentDistributor",executiveValidateToken,currentUser);
router.get("/getAlluser",GetAllUser)
router.get('/getStateCity/:email', getStateCity);
router.get('/superStockist/:id', getDistributorBySuperByID);

module.exports =router;