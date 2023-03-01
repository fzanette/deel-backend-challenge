const { HttpError } = require("../utils/httpError");
const { depositMoney } = require("../services/balance");

const depositMoneyToProfile = async (req, res) => {
  try {
    const profile = req.profile;
    const userId = Number(req.params.userId);
    const depositAmount = Number(req.body.amount)
    if(!depositAmount || depositAmount<0)
        throw new HttpError("NOT_VALID_AMOUNT",400)
    const userWithNewBalance = await depositMoney(userId, profile, depositAmount);
    res.json(userWithNewBalance);
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server Error" });
  }
};

module.exports = {depositMoneyToProfile};
