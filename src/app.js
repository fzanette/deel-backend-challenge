const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const contractsRouter = require('./routes/contract');
const jobsRouter = require('./routes/job');
const balancesRouter = require('./routes/balance');
const adminRouter = require('./routes/admin');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use(getProfile);
app.use('/contracts', contractsRouter);
app.use('/jobs', jobsRouter);
app.use('/balances', balancesRouter);
app.use('/admin', adminRouter);

module.exports = app;
