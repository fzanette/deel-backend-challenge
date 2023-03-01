const { Job, Contract, Profile, sequelize } = require("../model");
const { Op, QueryTypes } = require("sequelize");

const findBestProfession = async (startDate, endDate) => {
  const bestPaidProfessions = await Job.findAll({
    attributes: [
      [sequelize.col("Contract.Contractor.profession"), "profession"],
      [sequelize.fn("SUM", sequelize.col("Job.price")), "totalEarned"],
    ],
    raw: true,
    group: sequelize.col("Contract.Contractor.profession"),
    order: [["profession", "DESC"]],
    limit: 1,
    include: {
      model: Contract,
      attributes: [],
      required: true,
      include: {
        model: Profile,
        as: "Contractor",
        attributes: [],
        required: true,
      },
    },
    where: {
      paid: true,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
  return bestPaidProfessions[0];
};

const findBestClients = async (startDate, endDate, limit) => {
  const bestClients = await sequelize.query(
    `
        select p.id as id, p.firstName || ' ' || p.lastname as fullName, SUM(j.price) as paid 
        from "Jobs" j 
        inner join "Contracts" c on j.ContractId = c.id 
        inner join "Profiles" p on c.ClientId = p.id 
        where j.paid = true
        and j.paymentDate BETWEEN :startDate and :endDate
        group by p.id
        order by paid desc
        limit :limit
        `,
    {
      replacements: {
        startDate,
        endDate,
        limit,
      },
      type: QueryTypes.SELECT,
    }
  );
  return bestClients;
};

module.exports = { findBestProfession,findBestClients };
