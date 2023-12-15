const express = require('express');
const router = express.Router();
const { test, updateUser, deleteUser, getUserListing } = require('../controllers/user.controller.js');
const verifyToken = require('../utils/verifyUser.js');

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListing)

module.exports = router;