const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateDistributorToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  // Check if the token exists in the Authorization header
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract the token

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }

      // Attach the decoded distributor data to the request object
      req.userdistributor = decoded.userdistributor;
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    res.status(401);
    throw new Error("Authorization header missing or invalid");
  }
});

module.exports = validateDistributorToken;