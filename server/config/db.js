const mongoose = require('mongoose');
require('dotenv').config(); // If you're using environment variables

// Define the database connection URL. You can use environment variables here.
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/dev';

console.log("dbURL: ", dbURL)

// Establish the database connection
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event listeners for the database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
