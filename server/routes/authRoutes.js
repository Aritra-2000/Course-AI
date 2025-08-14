const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google', authController.googleLogin);

router.get('/profile', (req, res) => res.json({ msg: 'Get user profile' }));
router.post('/logout', (req, res) => res.json({ msg: 'Logout user' }));

module.exports = router;