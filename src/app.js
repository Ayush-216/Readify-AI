const express = require('express');
const app = express();

app.use(express.json());

// require all routes here
const authRouter = require('./routes/auth.routes');

// auth related api can be accessed through this route
app.use('/api/auth', authRouter);

module.exports = app;
const port = 3000;