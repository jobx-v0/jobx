const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers.authorization;

  // Check if the token is missing
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - Token missing." });
  }

  // Check if the token starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid token format." });
  }

  // Extract the token without the "Bearer " prefix
  const token = authHeader.substring(7);

  try {
    // Verify the token
    const secretKey = process.env.JWT_TOKEN_SECRET_KEY;
    const decoded = jwt.verify(token, secretKey); // Replace 'your-secret-key' with your actual secret key

    // Attach the user object to the request for further use if needed
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid
    return res.status(401).json({ message: "Unauthorized - Invalid token." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    console.log("Only Admin has access to this route.")
    res.status(403).json({ error: "Forbidden" });
  }
};

module.exports = {
  authMiddleware,
  isAdmin,
};
