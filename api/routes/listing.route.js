const express = require('express');
const verifyToken = require('../utils/verifyUser');
const { createListing, deleteUserListing, updateUserListing } = require('../controllers/listing.controller')

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteUserListing);
router.post('/update/:id', verifyToken, updateUserListing)

module.exports = router