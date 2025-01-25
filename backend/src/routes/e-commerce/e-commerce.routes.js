const express = require("express");
const {uploadProduct,getAllProduct , updateProductById,deleteProductById,getProductById} = require("../../controllers/e-commerce_prodect/e-commerce_product.controller");


const router  = express.Router();

router.route("/").post(uploadProduct).get(getAllProduct);
router.route("/update/:id").put(updateProductById);
router.route("/:id").delete(deleteProductById);

router.route("/:id").get(getProductById);
module.exports = router