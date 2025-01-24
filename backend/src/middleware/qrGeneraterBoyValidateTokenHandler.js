
const jwt = require("jsonwebtoken");

const qrGeneraterBoyValidateTokenHandler = (req, res, next) => {
  // Extract the Bearer token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token is missing" });
  }

  // Verify the token with the secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const errorMessage = err.name === "TokenExpiredError"
        ? "Token has expired"
        : "Token is invalid";

      return res.status(403).json({ error: errorMessage });
    }

    req.user = decoded.user; // Attach decoded user information to request
    next(); // Proceed to the next middleware/controller
  });
};

module.exports = qrGeneraterBoyValidateTokenHandler;
