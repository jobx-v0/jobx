const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Register a new user
register = async (req, res) => {
    try {
      // Retrieve user data from the request body
      const { username, password } = req.body;

      // Check if the username or password is missing
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      // Check if the username already exists in the database
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log("Username already exists!!!");
        return res.status(400).json({ message: 'Username is already in use.' });
      }

      // Create a new user document and set the virtual 'password' field
      const newUser = new User({ username, password });

      // Save the user document to the database
      await newUser.save();
      console.log("New User Saved")

      res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};


// Log in an existing user
login = async (req, res) => {
    try {
      // Retrieve user data from the request body
      const { username, password } = req.body;

      // Check if the username or password is missing
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      // Find the user in the database by their username
      const user = await User.findOne({ username });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Verify the user's password using the virtual 'password' field
      if (user.authenticate(password)) {
        // Password is correct, generate a JWT token
        const secretKey = process.env.JWT_TOKEN_SECRET_KEY
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
        console.log("Authenticated new user")
        // Send the token in the response
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid password.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed. Please try again.' });
    }
  };

const getUser = async (req, res) => {
    try {
      // Fetch user info based on the authenticated user
      console.log(req);
      const token = req.headers.authorization.split(' ')[1];
      const { userId } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Extract username and send it in the response
      const username = user.username;
      res.json({ 'username': username });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Error fetching user info' });
  }

}

const AuthController = {
    register,
    login,
    getUser
}

module.exports = AuthController;