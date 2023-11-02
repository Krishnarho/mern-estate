const express = require('express');
const auth = require('../controllers/auth.controller.js')
const router = express.Router();

router.post('/signup', auth)

module.exports = router;