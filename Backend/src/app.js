const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));

// require all routes here
const authRouter = require('./routes/auth.routes');

// auth related api can be accessed through this route
app.use('/api/auth', authRouter);

module.exports = app;
const port = 3000;