const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        console.log("JWT Token Received:", token);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                res.status(401);
                throw new Error("User is not authorized");
            }
            // Attach decoded user information to req.user
            req.user = decoded.user; // Ensure the token's payload includes a 'user' object
            console.log("Decoded User:", req.user);
            next();
        });
    } else {
        res.status(401);
        throw new Error("Authorization header missing or invalid");
    }
});

module.exports = validateToken;