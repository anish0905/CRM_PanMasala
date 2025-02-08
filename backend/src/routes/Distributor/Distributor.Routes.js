const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  currentUser,
  getStateCity,
  GetAllUser,
  getUserDetailsByEmail,
  getDistributorBySuperByID,
  updateUser,
  requestDeleteByIdDistributor,
  feaDetailsList,
} = require("../../controllers/Distributor/Distributor.Controller");
const executiveValidateToken = require("../../middleware/executiveValidateTokenHandler");

//Register
router.post("/register", registerUser);

//Login

router.post("/loginexDistributor", loginUser);

router.post("/email", getUserDetailsByEmail);

router.put("/update/:id", updateUser);

router.delete(
  "/requestDeleteByIdDistributor/delete",
  requestDeleteByIdDistributor
);

//Current user information

router.get("/feaDetails/:id", feaDetailsList);

router.get("/currentDistributor", executiveValidateToken, currentUser);
router.get("/getAlluser", GetAllUser);
router.get("/getStateCity/:email", getStateCity);
router.get("/superStockist/:id", getDistributorBySuperByID);

module.exports = router;
