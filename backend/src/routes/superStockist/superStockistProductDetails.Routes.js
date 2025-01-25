const express = require("express");
const router = express.Router();
const {
  getSuperStockistProducts,
  getSuperStockistProduct,
  createSuperStockistProduct,
  updateSuperStockistProduct,
  deleteSuperStockistProduct,
  allSuperStockistsProductSell,
} = require("../../controllers/superStockist/superstockistProductController");
const validateToken = require("../../middleware/validateTokenHandler");

// Apply authentication middleware globally
router.use(validateToken);

// Route to get all products or create a new product
router.route("/")
  .get(getSuperStockistProducts) // GET /api/superstockistproducts
  .post(createSuperStockistProduct); // POST /api/superstockistproducts

// Route for aggregated product sales
router.route("/sales").get(allSuperStockistsProductSell); // GET /api/superstockistproducts/sales

// Route to get, update, or delete a specific product by ID
router.route("/:id")
  .get(getSuperStockistProduct) // GET /api/superstockistproducts/:id
  .put(updateSuperStockistProduct) // PUT /api/superstockistproducts/:id
  .delete(deleteSuperStockistProduct); // DELETE /api/superstockistproducts/:id

module.exports = router;
