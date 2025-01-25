const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const SuperStockistProduct = require("../../models/superStockist/superStockistProductDetails.Model");

// Joi schema for validation
const validateProductInput = (data) => {
  const schema = Joi.object({
    productName: Joi.string().required(),
    productDescription: Joi.string().required(),
    flavour: Joi.string().required(),
    productSize: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().positive().required(),
  });
  return schema.validate(data);
};

// @desc Get all products for a user
// @route GET /api/superstockistproducts
// @access Private
const getSuperStockistProducts = asyncHandler(async (req, res) => {
  const products = await SuperStockistProduct.find({ user_id: req.userExecutive.id });
  res.status(200).json(products);
});

// @desc Get a single product by ID
// @route GET /api/superstockistproducts/:id
// @access Private
const getSuperStockistProduct = asyncHandler(async (req, res) => {
  const product = await SuperStockistProduct.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to access this product");
  }

  res.status(200).json(product);
});

// @desc Create a new product
// @route POST /api/superstockistproducts
// @access Private
const createSuperStockistProduct = asyncHandler(async (req, res) => {
  const { error } = validateProductInput(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { productName, productDescription, flavour, productSize, price, quantity } = req.body;
  const newProduct = await SuperStockistProduct.create({
    user_id: req.userExecutive.id,
    productName,
    productDescription,
    flavour,
    productSize,
    price,
    quantity,
  });

  res.status(201).json(newProduct);
});

// @desc Update a product
// @route PUT /api/superstockistproducts/:id
// @access Private
const updateSuperStockistProduct = asyncHandler(async (req, res) => {
  const product = await SuperStockistProduct.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update this product");
  }

  const updatedProduct = await SuperStockistProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedProduct);
});

// @desc Delete a product
// @route DELETE /api/superstockistproducts/:id
// @access Private
const deleteSuperStockistProduct = asyncHandler(async (req, res) => {
  const product = await SuperStockistProduct.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user_id.toString() !== req.userExecutive.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete this product");
  }

  await SuperStockistProduct.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Product deleted successfully" });
});

// @desc Get all super stockist product sales (aggregate)
// @route GET /api/superstockistproducts/sales
// @access Private
const allSuperStockistsProductSell = asyncHandler(async (req, res) => {
  const products = await SuperStockistProduct.aggregate([
    {
      $addFields: {
        totalPrice: { $multiply: ["$price", "$quantity"] }, // Calculate the total price
      },
    },
    {
      $sort: { totalPrice: -1 }, // Sort by total price in descending order
    },
  ]);
  res.status(200).json(products);
});

module.exports = {
  getSuperStockistProducts,
  getSuperStockistProduct,
  createSuperStockistProduct,
  updateSuperStockistProduct,
  deleteSuperStockistProduct,
  allSuperStockistsProductSell,
};
