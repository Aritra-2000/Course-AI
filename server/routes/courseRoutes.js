const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCourse,
  getCourseById,
  getUserCourses,
  deleteCourse,
  updateCourse,
} = require('../controllers/courseController');

router.post('/', auth, createCourse);

router.get('/my-courses', auth, getUserCourses);

router.get('/:id', getCourseById);

router.delete('/:id', auth, deleteCourse);

router.put('/:id', auth, updateCourse);

module.exports = router;
