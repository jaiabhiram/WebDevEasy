const mongoose = require('mongoose');

const CriteriaSchema = mongoose.Schema({
    selector: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    contains: {
        type: [this], // Reference to itself to allow nested structures
        default: undefined 
    }
}, { _id: false });

const assignmentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A Assignment must have a title'],
    },
    question: {
      type: String,
      required: [true, 'A Assignment must have a question'],
    },
    criteria: [CriteriaSchema],
    difficulty: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
