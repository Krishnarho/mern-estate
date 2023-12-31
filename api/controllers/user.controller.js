const Listing = require("../models/listing.model.js");
const User = require("../models/user.model.js");
const errorHandler = require("../utils/error");
const brcyptjs = require('bcryptjs');

const test = (req, res) => {
    res.json({ action: "Holy cow!" })
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) (next(errorHandler(401, 'You can only update your own account!'))) // req.user comes from verifyUser

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
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted..');
    } catch (error) {
        next(error)
    }
}

const getUserListing = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listing!'))
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(errorHandler(404, 'User not found!'));
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

module.exports = { test, updateUser, deleteUser, getUserListing, getUser };