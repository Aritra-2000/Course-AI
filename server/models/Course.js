const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: String, // Google sub
    required: true
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  tags: [String]
}, { timestamps: true });

// Ensure a creator can only have one course per slug
courseSchema.index({ creator: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);