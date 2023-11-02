const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/error.js')

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashPassword });
    try {
        await newUser.save();
        res.status(201).json("User created Successfully!");
    } catch (err) {
        next(err);
    }
};

module.exports = signup;