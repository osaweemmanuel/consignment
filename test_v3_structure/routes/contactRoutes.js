const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/contactController');

/**
 * 🔗 @route   POST /api/v1/contact
 * 🛡️ @access  Public
 */
router.post("/", submitInquiry);

module.exports = router;
