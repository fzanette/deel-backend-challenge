const { findUnpaidJobs, payJob } = require("../services/job");

const getUnpaidJobsForProfile = async (req, res) => {
    try {
      const profile = req.profile;
      const jobs = await findUnpaidJobs(profile.id);
      res.json(jobs);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Server Error" });
    }
  };

  const payForJob = async (req, res) => {
    try {
      const profile = req.profile;
      const jobId = Number(req.params.job_id);
      const paidJob = await payJob(jobId,profile.id);
      res.status(201).json({paidJob})
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Server Error" });
    }
  };
  
  
  module.exports = { getUnpaidJobsForProfile, payForJob };
