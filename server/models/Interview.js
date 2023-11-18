const mongoose = require('mongoose');
const { Schema } = mongoose;

const interviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  interview: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ]
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
