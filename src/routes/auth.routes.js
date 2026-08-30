const express = require('express');
const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

// @route POST /api/auth/register
// @description register a new user
// @access public

authRouter.post('/register',authController.registerUserController);

module.exports = authRouter;