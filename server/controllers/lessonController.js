const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');
const Course = require('../models/Course'); 
const Module = require('../models/Module'); 
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const youtubeService = require('../services/youtubeService');

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (!lesson.content || lesson.content.length === 0) {
      const [generatedContent, videoId] = await Promise.all([
                geminiService.generateLessonContent(lesson.title),
        youtubeService.findVideoForLesson(lesson.title).catch(err => {
          console.error('YouTube search failed, continuing without video:', err.message);
          return null; 
        })
      ]);
      
      lesson.content = generatedContent;
      if (videoId) {
        lesson.youtubeVideoId = videoId;
      }
      await lesson.save();
    }

    res.json(lesson);
  } catch (error) {
    console.error(`Error fetching lesson: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ message: 'Parent course not found' });
    }
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || course.creator !== currentUser.sub) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);

  } catch (error) {
    console.error(`Error updating lesson: ${error.message}`);
    res.status(500).json({ message: 'Server error during lesson update' });
  }
};

const deleteLesson = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const lesson = await Lesson.findById(req.params.id).session(session);

    if (!lesson) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course).session(session);
    if (!course) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Parent course not found' });
    }
    const currentUser = await User.findById(req.user.id).session(session);
    if (!currentUser || course.creator !== currentUser.sub) {
      await session.abortTransaction();
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Module.findByIdAndUpdate(lesson.module, 
      { $pull: { lessons: lesson._id } }, 
      { session }
    );
    await lesson.deleteOne({ session });

    await session.commitTransaction();
    res.json({ message: 'Lesson removed successfully' });

  } catch (error) {
    await session.abortTransaction();
    console.error(`Error deleting lesson: ${error.message}`);
    res.status(500).json({ message: 'Server error during lesson deletion' });
  } finally {
    session.endSession();
  }
};

module.exports = { getLessonById, updateLesson, deleteLesson };
