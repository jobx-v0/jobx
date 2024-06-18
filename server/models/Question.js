const mongoose = require("mongoose");
const { Schema } = mongoose;
const Skill = require("./Skill");

const questionSchema = new Schema({
  category: String,
  sub_category: String,
  type: String,
  question: { type: String, required: true },
  skills: [
    {
      type: Skill.schema, // Use the schema from the imported Skill model
    },
  ],
  jobs: [String], // Array of job IDs associated with the question
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
