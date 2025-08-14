const express = require('express');
const router = express.Router();
const { getLessonById, updateLesson, deleteLesson } = require('../controllers/lessonController');
const auth = require('../middleware/auth');

router.delete('/:id', (req, res) => res.json({ msg: `Delete lesson ${req.params.id}` }));

router.get('/:id', auth, getLessonById);

router.put('/:id', auth, updateLesson);

router.delete('/:id', auth, deleteLesson);

module.exports = router;