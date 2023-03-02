const express = require('express');
const router = express.Router();
const { depositMoneyToProfile } = require('../controllers/balance');

router.post('/deposit/:userId', depositMoneyToProfile);

module.exports = router;
