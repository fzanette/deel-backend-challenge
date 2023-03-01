const { Job, Contract, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

const { HttpError } = require("../utils/httpError");

const depositMoney = async (
  targetClientId,
  profileCalling,
  depositAmount
) => {
  if (profileCalling.type !== "client")
    throw new HttpError("PROFILE_CALLING_MUST_BE_A_CLIENT", 401);
  if (profileCalling.id !== targetClientId)
    throw new HttpError("ONLY_SELF_TARGETED_DEPOSITS_ALLOWED", 401);

  const clientDebtSum = await findClientDebtSum(targetClientId);
  const depositLimit = clientDebtSum * 0.25;
  if (clientDebtSum && depositAmount > depositLimit)
    throw new HttpError("CLIENT_DEPOSIT_LIMIT_EXCEEDED", 409);

  const t = await sequelize.transaction();
  try {
    const client = await Profile.findByPk(targetClientId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    await client.update({ balance: client.balance + depositAmount }, {transaction : t});
    await t.commit();
    return await client.reload();
  } catch (error) {
    await t.rollback();
    throw new HttpError(
      error.message || "Server Error",
      error.statusCode || 500
    );
  }
};
const findClientDebtSum = async (clientId) => {
   const clientDebtSum = Job.sum("price", {
    where: {
      [Op.or]: [{ paid: null }, { paid: false }],
    },
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          ClientId: clientId,
        },
      },
    ],
  });
  return clientDebtSum || 0
}

module.exports = { depositMoney };
