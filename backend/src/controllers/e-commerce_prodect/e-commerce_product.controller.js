const Product = require("../../models/e-commerce_product/e-commerce_product.model");
const upload = require("../../modules/File.modules");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const uploadProduct = (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send(err.message);
    } else if (err) {
      return res.status(500).send("An unknown error occurred");
    }

    // Extracting fields from req.body
    const { title, description, price } = req.body;

    // Ensure req.file is available
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileData = new Product({
      image: req.file.filename, // Corrected from req.file.image
      title,
      description,
      price,
    });

    try {
      await fileData.save();
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      res.json({
        message: "Upload successful",
        file: req.file,
        url: fileUrl,
        fileData,
      });
    } catch (error) {
      res.status(500).send("Error saving file data to the database.");
    }
  });
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .send({ message: "Products retrieved successfully", products });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching data", error: error.message });
  }
};

const updateProductById = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).send(err.message);
    } else if (err) {
      return res.status(500).send("An unknown error occurred");
    }

    const { id } = req.params; // Get the product ID from URL
    const { title, description, price } = req.body; // Get product details from request body

    // Build the update object
    const updateData = {
      title,
      description,
      price,
    };

    // Handle image update if provided
    if (req.file) {
      updateData.image = req.file.filename; // Only update if a new file is uploaded
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Send response with updated product
      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  });
};

const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      deletedProduct.image
    );

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
        return res.status(500).json({
          message: "Product deleted, but image deletion failed",
          error: err.message,
        });
      }
      res.json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadProduct,
  getAllProduct,
  updateProductById,
  deleteProductById,
  getProductById,
};
