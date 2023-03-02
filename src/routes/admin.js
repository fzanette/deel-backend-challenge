const express = require('express');
const router = express.Router();
const { getBestProfession, getBestClients } = require('../controllers/admin');

router.get('/best-profession', getBestProfession);
router.get('/best-clients', getBestClients);

module.exports = router;
