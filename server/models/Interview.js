const mongoose = require("mongoose");
const { Schema } = mongoose;

Schema.Types.String.checkRequired((v) => v != null);

const interviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  data: [
    {
      question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: { type: String, required: true },
      _id: false,
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
