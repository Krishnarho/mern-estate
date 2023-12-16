const express = require('express');
const verifyToken = require('../utils/verifyUser');
const { createListing, deleteUserListing } = require('../controllers/listing.controller')

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteUserListing)

module.exports = router