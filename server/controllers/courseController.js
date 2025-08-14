const mongoose = require('mongoose');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const { findVideoForLesson } = require('../services/youtubeService');

// Simple slugify helper
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

exports.createCourse = async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ message: 'Please provide a topic' });
  }

  try {
   
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const topicSlug = slugify(topic || '');
    if (topicSlug) {
      const existingBySlug = await Course.findOne({ creator: currentUser.sub, slug: topicSlug });
      if (existingBySlug) {
        return res.status(200).json({ message: 'Existing course found', courseId: existingBySlug._id });
      }
    
      const existingByTitle = await Course.findOne({
        creator: currentUser.sub,
        title: { $regex: `^${topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      });
      if (existingByTitle) {
        return res.status(200).json({ message: 'Existing course found', courseId: existingByTitle._id });
      }
    }

   
    const courseData = await geminiService.generateCourseOutline(topic);


    let baseSlug = slugify(courseData.title || topic || 'course');
    if (!baseSlug) baseSlug = 'course';
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existing = await Course.findOne({ creator: currentUser.sub, slug });
      if (!existing) break;
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const course = await Course.create({
      title: courseData.title,
      description: courseData.description,
      tags: courseData.tags,
      creator: currentUser.sub,
      slug,
    });

    for (const moduleData of courseData.modules) {
      const module = await Module.create({
        title: moduleData.title,
        course: course._id,
      });

      course.modules.push(module._id);

      for (const lessonData of moduleData.lessons) {
        const title = typeof lessonData === 'string' ? lessonData : lessonData.title;

        let contentBlocks = [];
        try {
          contentBlocks = await geminiService.generateLessonContent(title);
        } catch (e) {
          console.warn(`Lesson content generation failed for "${title}": ${e.message}`);
        }

        let youtubeVideoId = null;
        try {
          youtubeVideoId = await findVideoForLesson(title);
        } catch (e) {
          console.warn(`YouTube search failed for "${title}": ${e.message}`);
        }

        const lesson = await Lesson.create({
          title,
          content: contentBlocks,
          youtubeVideoId,
          module: module._id,
          course: course._id,
        });

        module.lessons.push(lesson._id);
      }

      await module.save();
    }

    await course.save();

    res.status(201).json({ message: 'Course created successfully', courseId: course._id });
  } catch (error) {
    console.error(`Error creating course: ${error.message}`);
    res.status(500).json({ message: 'Server error during course creation' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id).populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        model: 'Lesson',
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

  
    if (!course.modules || course.modules.length === 0) {
      const modules = await Module.find({ course: course._id })
        .populate('lessons');
      course = course.toObject();
      course.modules = modules;
      return res.json(course);
    }

    res.json(course);
  } catch (error) {
    console.error(`Error fetching course: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserCourses = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }
    const courses = await Course.find({ creator: currentUser.sub }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error(`Error fetching user courses: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (course.creator !== currentUser.sub) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Lesson.deleteMany({ course: course._id }, { session });
      await Module.deleteMany({ course: course._id }, { session });
      await Course.findByIdAndDelete(req.params.id, { session });

      await session.commitTransaction();
      res.json({ message: 'Course removed' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error(`Error deleting course: ${error.message}`);
    res.status(500).json({ message: 'Server error during course deletion' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user owns the course
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (course.creator !== currentUser.sub) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.tags = tags || course.tags;

    const updatedCourse = await course.save();
    res.json(updatedCourse);

  } catch (error) {
    console.error(`Error updating course: ${error.message}`);
    res.status(500).json({ message: 'Server error during course update' });
  }
};
