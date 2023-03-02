const express = require('express');
const router = express.Router();
const {
  getOneContractForProfile,
  getContractsForProfile,
} = require('../controllers/contract');

router.get('/:id', getOneContractForProfile);
router.get('/', getContractsForProfile);

module.exports = router;
