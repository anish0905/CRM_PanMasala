const asyncHandler = require("express-async-handler");
const SuperStockistRegistered = require("../../models/superStockist/superStockist.Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

function validatePassword(password) {
  const minLength = 8; // Minimum length for the password
  const maxLength = 20; // Maximum length for the password
  return password.length >= minLength && password.length <= maxLength;
}

// @desc Register a admin
//@route POST/api/users/register
//@access public

const registerUser = asyncHandler(async (req, resp) => {
  const {
    cnf, // Ensure `cnf` is provided in the request body
    username,
    email,
    password,
    confirmPassword,
    country,
    state,
    city,
    district,
    address,
    pinCode,
    wareHouseName,
    mobileNo,
  } = req.body;

  // Validate required fields
  if (
    !cnf || // Validate `cnf` here
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !country ||
    !state ||
    !city ||
    !address ||
    !pinCode ||
    !district ||
    !mobileNo
  ) {
    throw new Error("All fields are mandatory!");
  }

  // Validate passwords
  if (password !== confirmPassword) {
    throw new Error("Password and confirmPassword do not match!");
  }

  if (!validatePassword(password)) {
    throw new Error("Password must be between 8 and 20 characters long.");
  }

  // Check if user already exists
  const superStockistSignupAvailable = await SuperStockistRegistered.findOne({
    email,
  });

  if (superStockistSignupAvailable) {
    throw new Error("User already registered!");
  }

  // Hash passwords
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const superStockistRegistered = await SuperStockistRegistered.create({
    cnf, // Include `cnf` here
    username,
    email,
    password: hashedPassword,
    country,
    state,
    city,
    address,
    pinCode,
    wareHouseName,
    mobileNo,
    district,
  });

  if (superStockistRegistered) {
    return resp.status(201).json({
      _id: superStockistRegistered.id,
      email: superStockistRegistered.email,
    });
  }

  // If user creation fails
  throw new Error("SuperStockist data is not valid");
});

// @desc Login a user
//@route POST/api/users/login
//@access public

const loginUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    resp.status(400);
    throw new Error("All fields are mandatory!");
  }

  const normalizedEmail = email.toLowerCase(); // Convert email to lowercase

  const superStockistRegistered = await SuperStockistRegistered.findOne({
    email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
  });

  // Compare password with hashed password
  if (
    superStockistRegistered &&
    (await bcrypt.compare(password, superStockistRegistered.password))
  ) {
    const accessToken = jwt.sign(
      {
        userExecutive: {
          username: superStockistRegistered.username,
          email: superStockistRegistered.email,
          id: superStockistRegistered.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1500m",
      }
    );

    // Send accessToken and userId in the response
    resp.status(200).json({
      accessToken,
      userId: superStockistRegistered.id, // Add the userId to the response
      message: "Login successful!",
    });
  } else {
    resp.status(401);
    throw new Error("Email or password is not valid");
  }
});

const updatePassword = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  console.log(`Received ID: ${id}`);

  // Ensure all required fields are provided
  if (!newPassword || !confirmNewPassword) {
    res.status(400).json({ message: "All fields are mandatory!" });
    return;
  }

  // Check if newPassword and confirmNewPassword match
  if (newPassword !== confirmNewPassword) {
    res
      .status(400)
      .json({ message: "New password and confirmation do not match!" });
    return;
  }

  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID!" });
      return;
    }

    // Find the user by ID
    const superStockistRegistered = await SuperStockistRegistered.findById(id);
    console.log(superStockistRegistered);
    if (!superStockistRegistered) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Use updateOne to update only the password field
    await SuperStockistRegistered.updateOne(
      { _id: id },
      { $set: { password: hashedNewPassword } }
    );

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(`Error updating password: ${error.message}`);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @desc current  userinfo
//@route POST/api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
  // Check if userExecutive exists on the request object
  if (req.userExecutive) {
    res.json({
      message: "superStockistRegistered current user information",
      user: req.userExecutive, // Send the userExecutive data
    });
  } else {
    res.status(400);
    throw new Error("User information not found");
  }
});

const GetAllUser = asyncHandler(async (req, resp) => {
  const getAllUser = await SuperStockistRegistered.find();
  resp.status(200).json(getAllUser);
});

// @desc Delete a user
//@route DELETE /api/users/:id
//@access private (can be modified based on your access control)

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the user ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID!" });
  }

  try {
    // Attempt to find and delete the user by ID
    const superStockistRegistered =
      await SuperStockistRegistered.findByIdAndDelete(id);

    // If the user does not exist, return a 404 error
    if (!superStockistRegistered) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Successfully deleted user
    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: superStockistRegistered,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the user. Please try again later.",
    });
  }
});

// @desc Update a user's information
//@route PUT /api/users/:id
//@access private

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    country,
    state,
    city,
    address,
    pinCode,
    wareHouseName,
    mobileNo,
  } = req.body;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID!" });
  }

  // Find the user by ID
  const superStockistRegistered = await SuperStockistRegistered.findById(id);

  if (!superStockistRegistered) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Update the user fields
  superStockistRegistered.username =
    username || superStockistRegistered.username;
  superStockistRegistered.email = email || superStockistRegistered.email;
  superStockistRegistered.country = country || superStockistRegistered.country;
  superStockistRegistered.state = state || superStockistRegistered.state;
  superStockistRegistered.city = city || superStockistRegistered.city;
  superStockistRegistered.address = address || superStockistRegistered.address;
  superStockistRegistered.pinCode = pinCode || superStockistRegistered.pinCode;
  superStockistRegistered.wareHouseName =
    wareHouseName || superStockistRegistered.wareHouseName;
  superStockistRegistered.mobileNo =
    mobileNo || superStockistRegistered.mobileNo;

  try {
    // Save the updated user details, wait for it to complete
    const updatedUser = await superStockistRegistered.save();

    // Only respond once the operation completes successfully
    return res
      .status(200)
      .json({ message: "User updated successfully!", user: updatedUser });
  } catch (error) {
    // Handle any potential errors that arise during save
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
});

const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Normalize email (optional, for case insensitivity)
  const normalizedEmail = email.toLowerCase();

  const user = await SuperStockistRegistered.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    res.status(404).json({ message: "User not found!" });
    return;
  }

  res.status(200).json(user);
});

// @desc Update a user's information
//@route put /api/users/:id
//@access private

const updateLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { locations } = req.body;

  // Validate that locations contain latitude and longitude
  if (!locations || !locations.latitude || !locations.longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required in locations!" });
  }

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID!" });
  }

  // Find the user by ID
  const superStockistRegistered = await SuperStockistRegistered.findById(id);
  if (!superStockistRegistered) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Update the location field
  superStockistRegistered.locations = locations;

  // Save the updated document
  await superStockistRegistered.save();

  res.status(200).json({
    message: "Location updated successfully",
    locations: superStockistRegistered.locations,
  });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  GetAllUser,
  updatePassword,
  deleteUser,
  updateUser,
  getUserByEmail,
  updateLocation,
};
