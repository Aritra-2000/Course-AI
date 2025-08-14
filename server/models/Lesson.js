const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    objectives: {
      type: [String],
      default: [],
    },
    content: [
      {
        type: { type: String, required: true }, // e.g., 'h2', 'p', 'code'
        content: { type: String, required: true },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    youtubeVideoId: { 
      type: String,
      default: null 
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    course: { // Added for easier back-navigation
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', LessonSchema);
