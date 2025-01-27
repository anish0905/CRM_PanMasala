const express = require("express");
const { createPanShopOwner
    ,updatePanShoperOwner
     ,deletePanShopOwner
     ,getAllPanShopOwner ,
     getPanShopOwnerById } = require("../../controllers/panshop/panShopOwnerController");

const router = express.Router();

router.route("/").post(createPanShopOwner)

router.route("/").get(getAllPanShopOwner);



router.route("/:id").get(getPanShopOwnerById);


router.route("/:id").put(updatePanShoperOwner);


router.route("/:id").delete(deletePanShopOwner);



module.exports = router;