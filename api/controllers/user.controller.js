const User = require("../models/user.model.js");
const errorHandler = require("../utils/error");
const brcyptjs = require('bcryptjs');

const test = (req, res) => {
    res.json({ action: "Holy cow!" })
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) (next(errorHandler(401, 'You can only update your own account!')))

    try {
        if (req.body.password) {
            req.body.password = brcyptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                }
            },
            { new: true }
        )

        const { password, ...rest } = updatedUser._doc;

        res.status(201).json(rest);
    } catch (err) {
        next(err);
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) (next(errorHandler(401, 'You can only delete your own account!')))

    try {
        await User.findByIdAndDelete(req.params.id);
        //res.clearCookies('access_token');
        res.status(200).json('User has been deleted..')
    } catch (error) {
        next(error)
    }
}

module.exports = { test, updateUser, deleteUser };