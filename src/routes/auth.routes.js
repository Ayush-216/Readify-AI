const express = require('express');
const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

/** 
* @route POST /api/auth/register
* @description register a new user
* @access public
*/

authRouter.post('/register',authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login a user with email and password
 * @access public
 */

authRouter.post('/login', authController.loginUserController);


/**
 * @route GET /api/auth/logout
 * @description logout a user by clearing the token cookie and add in blacklist
 * @access public
 */

authRouter.get('/logout', authController.logoutUserController);

module.exports = authRouter;