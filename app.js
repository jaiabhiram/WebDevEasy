const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const assignmentRouter = require('./routes/assignmentRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/v1/assignment', assignmentRouter);

module.exports = app;