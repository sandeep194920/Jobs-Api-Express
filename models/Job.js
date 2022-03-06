const mongoose = require('mongoose')
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide the position'],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      type: String,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', JobSchema)
