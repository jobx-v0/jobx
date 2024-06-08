const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Register a new user
router.post("/register", AuthController.register);

// Log in an existing user
router.post("/login", AuthController.login);

// Get User data based on authToken
router.get("/user/info", authMiddleware, AuthController.getUser);

// Other authentication-related routes can be added here

module.exports = router;
