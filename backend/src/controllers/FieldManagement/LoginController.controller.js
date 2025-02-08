const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FieldManager = require("../../models/FieldManagement/Login.model");
const { validationResult } = require("express-validator"); // For input validation
require("dotenv").config();
const InspectionShop = require("../../models/FieldManagement/inspectionShopDetails.model");
const DeleteRequest = require("../../models/FieldManagement/deleteRequestSchema");
// console.log(DeleteRequest);

// Utility to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

// Register Field Manager
const registerFieldManager = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg);
    }

    const {
      name,
      email,
      password,
      role,
      phoneNo,
      address,
      state,
      pincode,
      status,
      FEA_id,
      distributors_id,
    } = req.body;

    // Check if email already exists
    const existingUser = await FieldManager.findOne({ email });
    if (existingUser) {
      return handleError(res, 400, "Email already exists");
    }

    // Create a new Field Manager user
    const newUser = new FieldManager({
      name,
      email,
      password,
      phoneNo,
      role,
      address,
      state,
      pincode,
      status,
      FEA_id: FEA_id,
      distributors_id: distributors_id,
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: "Field Manager registered successfully" });
  } catch (error) {
    console.error("Error in register:", error);
    handleError(res, 500, "Internal server error");
  }
};

// Login Field Manager
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg);
    }

    // Find the user by email
    const user = await FieldManager.findOne({ email });
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    // Set the status to "Active" before validation
    if (user.status !== "Active") {
      user.status = "Active";
      await user.save();
    }

    // Validate the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return handleError(res, 401, "Invalid credentials");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        FEA_id: user.FEA_id,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    handleError(res, 500, "Internal server error");
  }
};

const getFieldManager = async (req, res) => {
  try {
    // Fetch Field Managers
    const fieldManagers = await FieldManager.find({});

    if (!fieldManagers.length) {
      return res.status(404).json({ message: "No field managers found" });
    }

    // Fetch Inspection Shop details for each field manager
    const inspectionShops = await InspectionShop.find({
      fieldManagerId: { $in: fieldManagers.map((fm) => fm._id) },
    });

    // Map inspection shops to their respective field managers
    const fieldManagersWithShops = fieldManagers.map((fm) => ({
      ...fm.toObject(),
      inspectionShops: inspectionShops.filter(
        (shop) => shop.fieldManagerId.toString() === fm._id.toString()
      ),
    }));

    res.json(fieldManagersWithShops);
  } catch (error) {
    console.error("Error getting field managers:", error);
    res.status(500).json({ message: "Server error in getting field managers" });
  }
};

const getFieldManagerbYfeaid = async (req, res) => {
  try {
    const id = req.params.id;
    const fieldManagers = await FieldManager.find({
      FEA_id: id,
    });

    if (!fieldManagers.length) {
      return res.status(404).json({ message: "No field managers found" });
    }

    // Fetch Inspection Shop details for each field manager
    const inspectionShops = await InspectionShop.find({
      fieldManagerId: { $in: fieldManagers.map((fm) => fm._id) },
    });

    // Map inspection shops to their respective field managers
    const fieldManagersWithShops = fieldManagers.map((fm) => ({
      ...fm.toObject(),
      inspectionShops: inspectionShops.filter(
        (shop) => shop.fieldManagerId.toString() === fm._id.toString()
      ),
    }));

    res.json(fieldManagersWithShops);
  } catch (error) {
    console.error("Error getting field managers:", error);
    res.status(500).json({ message: "Server error in getting field managers" });
  }
};

// update field manager by Id
const updateFieldManager = async (req, res) => {
  const { id } = req.params; // Field Manager's ID from URL params

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Field Manager ID is required",
    });
  }

  const {
    name,
    email,
    phoneNo,
    password,
    role,
    address,
    state,
    pincode,
    status,
  } = req.body;

  try {
    // Log the ID to verify it is being passed correctly
    console.log("Field Manager ID:", id);

    // Build the update object, only including fields that are provided
    let updateFields = {
      name,
      email,
      phoneNo,
      role,
      address,
      state,
      pincode,
      status,
    };

    // If a password is provided, hash it and add it to the update fields
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Find the Field Manager by ID and update the fields
    const fieldManager = await FieldManager.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!fieldManager) {
      return res.status(404).json({
        success: false,
        message: "Field Manager not found",
      });
    }

    // Return success response with the updated data
    res.status(200).json({
      success: true,
      message: "Field Manager updated successfully",
      data: fieldManager,
    });
  } catch (error) {
    console.error("Error updating Field Manager:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating Field Manager",
    });
  }
};

const getByIdFieldManager = async (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters

  try {
    if (!id) {
      return res.status(400).json({ message: "Field Manager ID is required" });
    }

    const fieldManager = await FieldManager.findById(id); // Use findById for a single document
    if (!fieldManager) {
      return res.status(404).json({ message: "Field Manager not found" });
    }

    res.json(fieldManager);
  } catch (error) {
    console.error("Error getting field manager:", error);
    res.status(500).json({ message: "Server error in getting field manager" });
  }
};

// const deleteByIdFieldManager = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!id) {
//       return res.status(400).json({ message: "Field Manager ID is required" });
//     }
//     const fieldManager = await FieldManager.findByIdAndDelete(id);
//     if (!fieldManager) {
//       return res.status(404).json({ message: "Field Manager not found" });
//     }
//     res.json({ message: "Field Manager deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting Field Manager:", error);
//     res.status(500).json({ message: "Server error in deleting Field Manager" });
//   }
// };

const requestDeleteByIdFieldManager = async (req, res) => {
  try {
    const { fieldManagerId, reason } = req.body;

    if (!fieldManagerId || !reason) {
      return res
        .status(400)
        .json({ message: "FieldManager ID and reason are required." });
    }

    const existingRequest = await DeleteRequest.findOne({
      fieldManagerId,
      status: "Pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Delete request is already pending." });
    }

    const deleteRequest = new DeleteRequest({ fieldManagerId, reason });
    await deleteRequest.save();

    res.json({
      message: "Delete request submitted successfully.",
      deleteRequest,
    });
  } catch (error) {
    console.error("Error submitting delete request:", error);
    res.status(500).json({ message: "Server error in submitting request." });
  }
};

const logout = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Field Manager ID is required" });
  }

  try {
    // Find the Field Manager by ID and update the status to "Inactive"
    const fieldManager = await FieldManager.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!fieldManager) {
      return res.status(404).json({ message: "Field Manager not found" });
    }

    // Send a response indicating successful logout
    res.status(200).json({
      message: "Field Manager logged out successfully",
      fieldManager: {
        id: fieldManager._id,
        status: fieldManager.status,
      },
    });
  } catch (error) {
    console.error("Error logging out Field Manager:", error);
    res.status(500).json({ message: "Error logging out Field Manager" });
  }
};

module.exports = {
  registerFieldManager,
  login,
  getFieldManager,
  updateFieldManager,
  getByIdFieldManager,
  requestDeleteByIdFieldManager,
  logout,
  getFieldManagerbYfeaid,
};
