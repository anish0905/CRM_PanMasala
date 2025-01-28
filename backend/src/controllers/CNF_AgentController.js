const CNFAgent = require("../models/CNF_Agent.Model");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, resp) => {
  const { username, email, password, confirmPassword, mobileNo, address, city, pinCode, district, state, region, location,subAdmin } = req.body;
  
  // Check if passwords match
  if (password !== confirmPassword) {
    resp.status(400);
    throw new Error("Password and confirmPassword are not matched!");
  }

  // Check if required fields are provided
  if (!username || !email || !password || !confirmPassword || !mobileNo || !address || !city || !pinCode || !district || !state || !region ) {
    resp.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Check if user already exists with the same email
  const userAvailable = await CNFAgent.findOne({ email });
  if (userAvailable) {
    resp.status(400);
    throw new Error("User already registered!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new CNFAgent user
  const newUser = await CNFAgent.create({
    username,
    email,
    password: hashedPassword,
    mobileNo,
    address,
    city,
    pinCode,
    district,
    state,
    region, // Added region here
    location,
    subAdmin
  });

  if (newUser) {
    resp.status(201).json({ _id: newUser.id, email: newUser.email });
  } else {
    resp.status(400);
    throw new Error("User creation failed.");
  }
});

// @desc Login a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    resp.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Find user by email
  const user = await CNFAgent.findOne({ email });

  // Check if user exists and password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate JWT token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    resp.status(200).json({
      accessToken,
      userId: user.id,
    });
  } else {
    resp.status(401);
    throw new Error("Email or password is not valid");
  }
});

// @desc Update user details
// @route PUT /api/users/update/:id
// @access Private
const updateUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, newPassword, confirmNewPassword, mobileNo, address, city, pinCode, district, state, region, location ,subAdmin} = req.body;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user ID!" });
    return;
  }

  // Find the user by ID
  const user = await CNFAgent.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found!" });
    return;
  }

  // Update fields provided in the request body
  if (username) user.username = username;
  if (email) user.email = email;
  if (mobileNo) user.mobileNo = mobileNo;
  if (address) user.address = address;
  if (city) user.city = city;
  if (pinCode) user.pinCode = pinCode;
  if (district) user.district = district;
  if (state) user.state = state;
  if (region) user.region = region; // Added region here
  if (location) user.location = location;
  if (subAdmin) user.subAdmin = subAdmin; // Added subAdmin here

  // If both new password and confirm new password are provided, check and update password
  if (newPassword && confirmNewPassword) {
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({ message: "New password and confirmation do not match!" });
      return;
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
  }

  // Save updated user details
  await user.save();

  res.status(200).json({ message: "User details updated successfully!" });
});

// @desc Get all users
// @route GET /api/users/
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await CNFAgent.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get current user info
// @route POST /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, resp) => {
  resp.json(req.user);
});

// @desc Delete a user
// @route DELETE /api/users/delete/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID!" });
      return;
    }

    // Find and delete the user by ID
    const deletedUser = await CNFAgent.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});






module.exports = {
  registerUser,
  loginUser,
  currentUser,
  updateUserDetails,
  getAllUsers,
  deleteUser,
 
};
