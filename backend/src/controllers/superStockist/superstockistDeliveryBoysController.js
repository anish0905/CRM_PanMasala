const SuperstockistdeliveryBoys = require("../../models/superStockist/SuperStockistdeliveryBoysDetails.Models"); // Adjust the path based on your project structure
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.createDeliveryBoy = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      phoneNo,
      address,
      city,
      pinCode,
      state,
      superstockist,
    } = req.body;

    // Validate required fields
    if (
      !username ||
      !email ||
      !password ||
      !phoneNo ||
      !address ||
      !city ||
      !pinCode ||
      !state
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists by email
    const existingUser = await SuperstockistdeliveryBoys.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered with this email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new delivery boy
    const newDeliveryBoy = await SuperstockistdeliveryBoys.create({
      username,
      email,
      password: hashedPassword, // Store hashed password
      phoneNo,
      address,
      city,
      pinCode,
      state,
      superstockist: superstockist, // Assuming stockist ID is provided in the request body
    });

    res
      .status(201)
      .json({
        message: "Delivery Boy created successfully",
        data: newDeliveryBoy,
      });
  } catch (error) {
    console.error("Error creating delivery boy:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PUT: Update delivery boy details
// PUT: Update delivery boy details
exports.updateDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // If a password is provided, hash it before updating
    if (updateFields.password) {
      const hashedPassword = await bcrypt.hash(updateFields.password, 10);
      updateFields.password = hashedPassword; // Replace plain password with hashed one
    }

    // Find and update the delivery boy with the fields provided
    const updatedDeliveryBoy =
      await SuperstockistdeliveryBoys.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

    if (!updatedDeliveryBoy) {
      return res.status(404).json({ message: "Delivery Boy not found" });
    }

    res
      .status(200)
      .json({
        message: "Delivery Boy updated successfully",
        data: updatedDeliveryBoy,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE: Remove delivery boy
exports.deleteDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the delivery boy
    const deletedDeliveryBoy =
      await SuperstockistdeliveryBoys.findByIdAndDelete(id);

    if (!deletedDeliveryBoy) {
      return res.status(404).json({ message: "Delivery Boy not found" });
    }

    res
      .status(200)
      .json({
        message: "Delivery Boy deleted successfully",
        data: deletedDeliveryBoy,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllDelivery = async (req, res) => {
  try {
    // Fetch all delivery boys from the database
    const deliveryBoys = await SuperstockistdeliveryBoys.find();

    // Check if no records are found
    if (deliveryBoys.length === 0) {
      return res.status(404).json({ message: "No delivery boys found" });
    }

    // Send the records as a response
    res
      .status(200)
      .json({
        message: "Delivery boys fetched successfully",
        data: deliveryBoys,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getbyId = async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({ message: "Delivery boy ID is required" });
    }

    // Find the delivery boy by ID
    const deliveryBoy = await SuperstockistdeliveryBoys.findById(id);

    // Check if the delivery boy exists
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    // Send the delivery boy as a response
    res.status(200).json({
      message: "Delivery boy fetched successfully",
      deliveryBoy,
    });
  } catch (error) {
    console.error("Error fetching delivery boy by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email and password are required!" });
  }

  try {
    const user = await SuperstockistdeliveryBoys.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const deliveryBoyToken = jwt.sign(
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "24h", // Token expiration
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        deliveryBoyToken,
        id: user._id,
      });
    }

    return res
      .status(401)
      .json({ success: false, error: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.getAllDeliveryBySuperStockistId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deliveryBoys = await SuperstockistdeliveryBoys.find({
      superstockist: id,
    });
    if (!deliveryBoys) {
      return res
        .status(404)
        .json({ message: "No delivery boys found for this superstockist" });
    }
    res
      .status(200)
      .json({
        message: "Delivery boys fetched successfully",
        data: deliveryBoys,
      });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
