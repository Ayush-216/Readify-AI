const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

/**  
* @name registerUserController
* @description register a new user , expects username, email and password in the request body
* @access public
*/

async function registerUserController(req, res) {

    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{ username }, { email }]
    })

    if(isUserAlreadyExists){

        // can also return a more specific message like "Username already taken" or "Account already exists with this email" based on which field is already taken, but for simplicity, we are returning a generic message here.

        // we will make it more specific later, but for now, we will keep it simple and return a generic message.
        return res.status(400).json({ message: "User already exists with this email or username" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash

    }) 

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )

    res.cookie('token', token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        })

}


/***
* @name loginUserController
* @description login a user , expects email and password in the request body
* @access public
*/


async function loginUserController(req, res) {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        res.cookie('token', token)
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })

}


/**
 * @name logoutUserController
 * @description logout a user by clearing the token cookie and add in blacklist
 * @access public
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if(token){
        // add the token to blacklist
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully" });
}

/**
 * @name getMeController
 * @description get the logged in user details
 * @access private
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    })

}



module.exports = {
     registerUserController,
     loginUserController,
    logoutUserController,
    getMeController
     };