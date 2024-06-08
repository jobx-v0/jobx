const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
  category: String,
  sub_category: String,
  type: String,
  question: { type: String, required: true },
  skills: [String], // Array of skills associated with the question
  jobs: [String],   // Array of job IDs associated with the question
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
