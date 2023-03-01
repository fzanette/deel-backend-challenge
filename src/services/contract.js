const { Contract } = require("../model");
const { Op } = require("sequelize");

const findOneContract = async (id, profileId) => {
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  return contract;
};
const findContracts = async (profileId) => {
    const contracts = await Contract.findAll({
        where: {
          status: { [Op.ne]: "terminated" },
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      });
    return contracts
  };


module.exports = {findOneContract, findContracts}