const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SubAdmin = require("../../models/subAdmin/subAdminModels");
const mongoose = require("mongoose");
const cnfagents = require("../../models/CNF_Agent.Model");

// @desc Register a subAdmin
//@route POST /api/users/register
//@access public
const registersubAdmin = expressAsyncHandler(async (req, resp) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    mobileNo,
    address,
    city,
    pinCode,
    location, // Added location here (could be text or coordinates)
    district,
    state,
  } = req.body;

  // Validate password match
  if (password !== confirmPassword) {
    resp.status(400);
    throw new Error("Password and confirmPassword do not match!");
  }

  // Validate required fields
  if (
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !mobileNo ||
    !address ||
    !city ||
    !pinCode
  ) {
    resp.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Check if the email is already registered
  const subAdminUserAvailable = await SubAdmin.findOne({ email });
  if (subAdminUserAvailable) {
    resp.status(400);
    throw new Error("User already registered!");
  }

  // Check if the mobile number is already registered
  const subAdminMobileAvailable = await SubAdmin.findOne({ mobileNo });
  if (subAdminMobileAvailable) {
    resp.status(400);
    throw new Error("Mobile number already registered!");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new subAdmin
  const newSubAdmin = await SubAdmin.create({
    username,
    email,
    password: hashedPassword,
    confirmPassword: hashedPassword, // Hashing confirmPassword too, if you want
    mobileNo,
    address,
    city,
    pinCode,
    location,
    district,
    state,
  });

  if (newSubAdmin) {
    resp.status(201).json({
      _id: newSubAdmin.id,
      email: newSubAdmin.email,
      username: newSubAdmin.username,
      mobileNo: newSubAdmin.mobileNo,
      address: newSubAdmin.address,
      city: newSubAdmin.city,
      pinCode: newSubAdmin.pinCode,
      location: newSubAdmin.location,
      district: newSubAdmin.district,
      state: newSubAdmin.state,
    });
  } else {
    resp.status(400);
    throw new Error("SubAdmin data is not valid");
  }
});

// @desc Login a subAdmin
//@route POST /api/users/login
//@access public
const loginsubAdmin = expressAsyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    resp.status(400).json({ message: "All fields are mandatory!" });
    return;
  }

  try {
    // Find the subAdmin by email
    const subAdmin = await SubAdmin.findOne({ email });
    if (!subAdmin) {
      resp.status(401).json({ message: "Email or password is not valid" });
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, subAdmin.password);
    if (!isPasswordValid) {
      resp.status(401).json({ message: "Email or password is not valid" });
      return;
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { subAdminId: subAdmin.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    resp.status(200).json({
      message: "Login successful",
      accessToken,
      userId: subAdmin.id,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    resp.status(500).json({ message: "An error occurred during login." });
  }
});

// @desc Update a subAdmin's details
//@route PUT /api/users/update/:id
//@access private

const updatesubAdmin = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    newPassword,
    confirmNewPassword,
    mobileNo,
    address,
    city,
    pinCode,
    location,
    district,
    state,
  } = req.body;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user ID!" });
    return;
  }

  try {
    const subAdmin = await SubAdmin.findById(id);
    if (!subAdmin) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Update fields if provided
    if (username) subAdmin.username = username;
    if (email) subAdmin.email = email;
    if (mobileNo) subAdmin.mobileNo = mobileNo;
    if (address) subAdmin.address = address;
    if (city) subAdmin.city = city;
    if (pinCode) subAdmin.pinCode = pinCode;
    if (location) subAdmin.location = location;
    if (district) subAdmin.district = district; // Added district here
    if (state) subAdmin.state = state; // Added state here

    // Check and update password if new password and confirmation password are provided
    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        res
          .status(400)
          .json({ message: "New password and confirmation do not match!" });
        return;
      }

      // Check password length (optional, but recommended for security)
      if (newPassword.length < 6) {
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters long." });
        return;
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      subAdmin.password = hashedNewPassword;
    }

    // Save the updated subAdmin document
    await subAdmin.save();

    // Respond with success
    res.status(200).json({ message: "SubAdmin details updated successfully!" });
  } catch (error) {
    console.error("Error updating SubAdmin:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
// @desc Get all subAdmins
//@route GET /api/users
//@access private
const getAllSubAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find({});
    res.status(200).json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get current user info
//@route POST /api/users/current
//@access private
const currentUser = expressAsyncHandler(async (req, resp) => {
  resp.json(req.userSubAdmin); // Assuming `req.userSubAdmin` is set after authentication
});

// @desc Delete a subAdmin
//@route DELETE /api/users/delete/:id
//@access private
const deleteSubAdmin = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user ID!" });
    return;
  }

  try {
    const deletedSubAdmin = await SubAdmin.findByIdAndDelete(id);
    if (!deletedSubAdmin) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({ message: "SubAdmin deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

const cnfDetailsBySubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    

    // Find distributors filtered by CNF ID
    const distributors = await cnfagents.find({
      subAdmin: id,
    });

    if (!distributors || distributors.length === 0) {
      return res.status(404).json({
        message: "No distributors found for this CNF ID",
      });
    }

    res.status(200).json({
      message: "Distributors fetched successfully",
      data: distributors,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching distributors",
      error: error.message,
    });
  }
};

module.exports = {
  cnfDetailsBySubAdmin,
  registersubAdmin,
  loginsubAdmin,
  currentUser,
  updatesubAdmin,
  getAllSubAdmin,
  deleteSubAdmin,
};
