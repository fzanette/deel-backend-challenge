const { HttpError } = require('../utils/httpError');
const { findBestProfession, findBestClients } = require('../services/admin');

const getBestProfession = async (req, res) => {
  try {
    const startDate = String(req.query.start);
    const endDate = String(req.query.end);
    const bestProfessions = await findBestProfession(startDate, endDate);
    res.json(bestProfessions);
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || 'Server Error' });
  }
};
const getBestClients = async (req, res) => {
  try {
    const startDate = String(req.query.start);
    const endDate = String(req.query.end);
    const limit = Number(req.query.limit) || 2;
    const bestClients = await findBestClients(startDate, endDate, limit);
    res.json(bestClients);
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || 'Server Error' });
  }
};

module.exports = { getBestProfession, getBestClients };
