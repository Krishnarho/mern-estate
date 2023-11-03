const express = require('express');
const auth = require('../controllers/auth.controller.js')
const router = express.Router();

router.post('/signup', auth);
router.post('/signin', auth);

module.exports = router;