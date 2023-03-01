const express = require('express');
const router = express.Router();
const {getUnpaidJobsForProfile, payForJob} = require("../controllers/job")

router.get('/unpaid', getUnpaidJobsForProfile)
router.post('/:job_id/pay', payForJob)


module.exports = router;
