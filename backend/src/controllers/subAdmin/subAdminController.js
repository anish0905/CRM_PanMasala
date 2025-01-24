const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const subAdmin = require("../../models/subAdmin/subAdminModels");
const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// @desc Register a admin
//@route POST/api/users/register
//@access publics

const registersubAdmin = asyncHandler(async (req, resp) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    resp.status(400);
    throw new Error("password and confirmPassword are not matched !");
  }

  if (!username || !email || !password || !confirmPassword) {
    resp.status(400);
    throw new Error("All fields are mandatory !");
  }

  const subAdminUserAvailable = await subAdmin.findOne({ email });
  if (subAdminUserAvailable) {
    resp.status(400);
    throw new Error("User already registered !");
  }

  //Hash password;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashedPassword);
  //console.log
  //Hash confirmPassword;

  const hashedCpassword = await bcrypt.hash(confirmPassword, 10);
  console.log("Hashed CPassword", hashedCpassword);

  const newSubAdmin = await subAdmin.create({
    username,
    email,
    password: hashedPassword,
    confirmPassword: hashedCpassword,
  });
  console.log(`subAdmin User created ${subAdmin}`);
  if (newSubAdmin) {
    resp.status(201).json({ _id: newSubAdmin.id, email: newSubAdmin.email });
  } else {
    resp.status(400);
    throw new Error("subAdmin data us not valid");
  }

  resp.status(200).json({ message: " Register the subAdmin" });
});

// @desc Login a user
//@route POST/api/users/login
//@access public

const loginsubAdmin = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    resp.status(400).json({ message: "All fields are mandatory!" });
    return;
  }

  try {
    // Check if subAdmin exists
    const SubAdmin = await subAdmin.findOne({ email }); // Ensure the model is imported properly

    if (!SubAdmin) {
      resp.status(401).json({ message: "Email or password is not valid" });
      return;
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, SubAdmin.password); // Corrected here

    if (!isPasswordValid) {
      resp.status(401).json({ message: "Email or password is not valid" });
      return;
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        usersubAdmin: {
          id: SubAdmin.id, // Include only necessary info in the token
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Respond with the token and userId
    resp.status(200).json({
      message: "Login successful",
      accessToken,
      userId: SubAdmin.id, // Corrected here
    });
  } catch (error) {
    console.error("Login error:", error.message);
    resp.status(500).json({ message: "An error occurred during login." });
  }
});

//

// @desc Update a user's password directly by object ID
// @route PUT /api/users/update-password/:id
// @access Private

// @desc Update administrator details
// @route PUT /api/users/update/:id
// @access Private
const updatesubAdmin = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, newPassword, confirmNewPassword } = req.body;

  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID!" });
      return;
    }

    // Find the administrator by ID
    const subAdmin = await subAdmin.findById(id);
    if (!subAdmin) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Update only the fields that are provided
    if (username) subAdmin.username = username;
    if (email) subAdmin.email = email;

    // If both newPassword and confirmNewPassword are provided, check and update password
    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        res
          .status(400)
          .json({ message: "New password and confirmation do not match!" });
        return;
      }
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      subAdmin.password = hashedNewPassword;
    }

    // Save the updated administrator
    await subAdmin.save();

    res.status(200).json({ message: "subAdmin details updated successfully!" });
  } catch (error) {
    console.error(`Error updating subAdmin details: ${error.message}`);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

const getAllSubAdmin = asyncHandler(async (req, res) => {
  try {
    // Fetch all administrators
    const subAdmin = await subAdmin.find({});

    // Send the retrieved data back as a JSON response
    res.status(200).json(subAdmin);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
});
// @desc current  userinfo
//@route POST/api/users/current
//@access private

const currentUser = asyncHandler(async (req, resp) => {
  resp.json(req.userAdministrator);
});

// @desc Delete an administrator
// @route DELETE /api/users/delete/:id
// @access Private
const deleteSubAdmin = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID!" });
      return;
    }

    // Find and delete the administrator by ID
    const deletedsubAdmin = await subAdmin.findByIdAndDelete(id);

    if (!deletedsubAdmin) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({ message: "subAdmin  deleted successfully!" });
  } catch (error) {
    console.error(`Error deleting subAdmin : ${error.message}`);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = {
  registersubAdmin,
  loginsubAdmin,
  currentUser,
  updatesubAdmin,
  getAllSubAdmin,
  deleteSubAdmin,
};
