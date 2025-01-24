const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const superStockistValidateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("Decoded JWT Token:", decoded); // Log the decoded token to verify its structure

            // Check if userExecutive exists in the decoded token
            if (decoded.userExecutive) {
                req.userExecutive = decoded.userExecutive;
                console.log("User Executive Data:", req.userExecutive); // Log the userExecutive data
            } else {
                res.status(400);
                throw new Error("User data is missing in the token");
            }

            next(); // Proceed to the next middleware or route
        } catch (err) {
            res.status(401);
            throw new Error("User is not authorized");
        }
    } else {
        res.status(401);
        throw new Error("Authorization header missing or invalid");
    }
});

module.exports = superStockistValidateToken;