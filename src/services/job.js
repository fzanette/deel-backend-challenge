const { Job, Contract, Profile, sequelize } = require('../model');
const { Op } = require('sequelize');
const { HttpError } = require('../utils/httpError');

const findUnpaidJobs = async (profileId) => {
  const jobs = await Job.findAll({
    where: {
      [Op.or]: [{ paid: null }, { paid: false }],
    },
    include: {
      model: Contract,
      attributes: [],
      required: true,
      where: {
        status: {
          [Op.eq]: 'in_progress',
        },
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    },
  });
  return jobs;
};

const payJob = async (jobId, profileId) => {
  const t = await sequelize.transaction();

  try {
    const job = await Job.findOne(
      {
        where: {
          id: jobId,
        },
        include: {
          model: Contract,
          required: true,
          where: {
            ClientId: profileId,
          },
          include: [
            { model: Profile, as: 'Contractor', required: true },
            { model: Profile, as: 'Client', required: true },
          ],
        },
      },
      { transaction: t, lock: t.LOCK.UPDATE }
    );

    if (!job) throw new HttpError('JOB_NOT_FOUND', 404);
    if (job.paid) throw new HttpError('JOB_ALREADY_PAID', 409);

    const client = job.Contract.Client;
    const contractor = job.Contract.Contractor;

    if (client.balance < job.price)
      throw new HttpError('INSUFICIENT_CLIENT_BALANCE', 409);

    await client.update(
      { balance: client.balance - job.price },
      { transaction: t }
    );
    await contractor.update(
      { balance: contractor.balance + job.price },
      { transaction: t }
    );
    await job.update(
      { paid: true, paymentDate: new Date() },
      { transaction: t }
    );
    await t.commit();
    return await job.reload();
  } catch (error) {
    await t.rollback();
    throw new HttpError(
      error.message || 'Server Error',
      error.statusCode || 500
    );
  }
};

module.exports = { findUnpaidJobs, payJob };
