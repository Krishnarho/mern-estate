const express = require('express');
const { signin, signup, google, signoutUser } = require('../controllers/auth.controller.js')
//const signup = require('../controllers/auth.controller.js')
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout/:id', signoutUser)

module.exports = router;