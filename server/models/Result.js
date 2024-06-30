const mongoose = require("mongoose");
const { Schema } = mongoose;

// Helper function to create a Map with default values
function createMapWithDefault(defaultValue) {
  return {
    type: Map,
    of: Number,
    default: new Map(),
    get: function (map) {
      return new Proxy(map, {
        get: (target, name) => (name in target ? target[name] : defaultValue),
      });
    },
  };
}

// Result Schema
const resultSchema = new Schema({
  interview_id: {
    type: Schema.Types.ObjectId,
    ref: "Interview",
    required: true,
  },
  question_scores: [
    {
      question_id: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      scores: createMapWithDefault(0),
      feedback: { type: String, required: true },
      _id: false,
    },
  ],
  total_score_in_each_category: createMapWithDefault(0),
  total_score: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
