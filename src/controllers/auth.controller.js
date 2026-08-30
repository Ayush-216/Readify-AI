const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @name registerUserController
// @description register a new user , expects username, email and password in the request body
// @access public


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

    const user = new userModel.create({
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




module.exports = { registerUserController };