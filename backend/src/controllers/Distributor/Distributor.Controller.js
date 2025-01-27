const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Distributor = require("../../models/Distributor/Distributor.Model");

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
    cnf,
    superstockist,
    username,
    email,
    password,
    confirmPassword,
    country,
    state,
    city,
    address,
    pinCode,

    district,
    mobileNo,
  } = req.body;

  // Validate required fields
  if (
    !cnf ||
    !superstockist ||
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
    resp.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Check password match
  if (password !== confirmPassword) {
    resp.status(400);
    throw new Error("Password and Confirm Password do not match!");
  }

  // Validate password strength
  if (!validatePassword(password)) {
    resp.status(400);
    throw new Error("Password must be between 8 and 20 characters long.");
  }

  // Check if user already exists
  const distributorUserAvailable = await Distributor.findOne({ email });
  if (distributorUserAvailable) {
    resp.status(400);
    throw new Error("User already registered!");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new distributor
  const distributor = await Distributor.create({
    cnf,
    superstockist,
    username,
    email,
    password: hashedPassword,

    country,
    state,
    city,
    address,
    pinCode,
    mobileNo,
    district,
  });

  // Response for successful creation
  if (distributor) {
    resp.status(201).json({
      message: "distributor registered successfully",
      _id: distributor.id,
      email: distributor.email,
    });
  } else {
    resp.status(400);
    throw new Error("Failed to register the distributor. Please try again.");
  }
});

// @desc Login a user
//@route POST/api/users/login
//@access public

const loginUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    resp.status(400);
    throw new Error("All fields are mandatory !");
  }

  const normalizedEmail = email.toLowerCase(); // Convert email to lowercase

  const distributor = await Distributor.findOne({
    email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
  });

  // Compare password with hashed password
  if (distributor && (await bcrypt.compare(password, distributor.password))) {
    const accessToken = jwt.sign(
      {
        userdistributor: {
          username: distributor.username,
          email: distributor.email,
          id: distributor._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1500m",
      }
    );

    // Respond with accessToken and userId
    resp.status(200).json({
      accessToken,
      userId: distributor._id,
    });
  } else {
    resp.status(401);
    throw new Error("Email or password is not valid");
  }
});

// @desc current  userinfo
//@route POST/api/users/current
//@access private

const currentUser = asyncHandler(async (req, resp) => {
  resp.json({ message: "distributor current user information" });
});

const getStateCity = asyncHandler(async (req, resp) => {
  const distributor = await Distributor.findOne({ email: req.params.email });
  if (!distributor) {
    resp.status(404);
    throw new Error("distributor not found");
  }
  resp.status(200).json({ state: distributor.state, city: distributor.city });
});

const getUserDetailsByEmail = async (req, res) => {
  const { email } = req.body; // Get the email from the request params

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Query the database for the user by email and populate the necessary fields
    const user = await Distributor.findOne({ email }).populate(
      "superDistributor"
    ); // Make sure 'superDistributor' is the correct field to populate

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details as a response
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const GetAllUser = asyncHandler(async (req, resp) => {
  const getAllUser = await Distributor.find();
  resp.status(200).json(getAllUser);
});

const getDistributorBySuperByID = asyncHandler(async (req, res) => {
  try {
    const superDistributorId = req.params.id;

    // Convert superDistributorId to ObjectId if it's not already an ObjectId
    const ObjectId = require("mongoose").Types.ObjectId;
    if (!ObjectId.isValid(superDistributorId)) {
      return res.status(400).json({ message: "Invalid superDistributorId" });
    }

    // Fetch Distributors based on superDistributorId
    const Distributors = await Distributor.find({
      superDistributor: new ObjectId(superDistributorId),
    });

    // Check if Distributors exist for the given ID
    if (!Distributors || Distributors.length === 0) {
      return res.status(404).json({
        message: "No Distributors found for the given superDistributorId.",
      });
    }

    // Send the found Distributors as a response
    res.status(200).json(Distributors);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching Distributors", error: error.message });
  }
});

// @desc Update an distributor's details
// @route PUT /api/users/update/:id
// @access private

const updateUser = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  const {
    username,
    email,
    password,
    country,
    state,
    city,
    address,
    pinCode,
    selectedSuperDistributor,
  } = req.body;

  // Validate password if provided
  if (password && !validatePassword(password)) {
    resp.status(400);
    throw new Error("Password must be between 8 and 20 characters long.");
  }

  // Find the distributor by id
  const distributor = await Distributor.findById(id);
  if (!distributor) {
    resp.status(404);
    throw new Error("distributor not found.");
  }

  // Update fields if provided
  if (username) distributor.username = username;
  if (email) distributor.email = email;
  if (password) distributor.password = await bcrypt.hash(password, 10); // Hash password if it's being updated
  if (country) distributor.country = country;
  if (state) distributor.state = state;
  if (city) distributor.city = city;
  if (address) distributor.address = address;
  if (pinCode) distributor.pinCode = pinCode;
  if (selectedSuperDistributor)
    distributor.superDistributorId = selectedSuperDistributor;

  // Save the updated distributor data
  const updateddistributor = await distributor.save();

  resp.status(200).json({
    message: "distributor updated successfully",
    updateddistributor: {
      _id: updateddistributor.id,
      username: updateddistributor.username,
      email: updateddistributor.email,
    },
  });
});

// @desc Delete an distributor's record
// @route DELETE /api/users/delete/:id
// @access private

// @desc Delete a distributor's record
// @route DELETE /api/users/delete/:id
// @access private

const deleteUser = asyncHandler(async (req, resp) => {
  const { id } = req.params;

  // Validate if the provided ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    resp.status(400);
    throw new Error("Invalid distributor ID");
  }

  // Find the distributor by ID
  const distributor = await Distributor.findById(id);

  // Check if the distributor exists
  if (!distributor) {
    resp.status(404);
    throw new Error("Distributor not found");
  }

  // Delete the distributor
  await distributor.remove();

  resp.status(200).json({
    message: "Distributor deleted successfully",
    distributorId: id,
  });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getStateCity,
  GetAllUser,
  getUserDetailsByEmail,
  getDistributorBySuperByID,
  updateUser,
  deleteUser,
};
