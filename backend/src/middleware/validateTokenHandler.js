const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        console.log("JWT Token Received:", token);  // Log the received JWT token for debugging purposes

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);  // Log the error
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.userAdministrator = decoded.userAdministrator;
            console.log(req.userAdministrator);  // Log decoded user info
            next();
        });
        
    } else {
        // If the authorization header is missing or invalid
        res.status(401);
        throw new Error("Authorization header missing or invalid");
    }
});

module.exports = validateToken;
