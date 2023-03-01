const { HttpError } = require("../utils/httpError");
const { findOneContract, findContracts } = require("../services/contract");

const getOneContractForProfile = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const profile = req.profile;
    const contract = await findOneContract(id, profile.id);
    if (!contract) throw new HttpError("NOT_FOUND_CONTRACT_FOR_PROFILE", 404);
    res.json(contract);
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server Error" });
  }
};

const getContractsForProfile = async (req, res) => {
  try {
    const profile = req.profile;
    const contracts = await findContracts(profile.id);
    res.json(contracts);
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server Error" });
  }
};

module.exports = { getOneContractForProfile, getContractsForProfile };
