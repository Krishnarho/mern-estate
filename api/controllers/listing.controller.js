const Listing = require('../models/listing.model');
const errorHandler = require('../utils/error');

const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (err) {
        next(err)
    }
}

const deleteUserListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) return next(errorHandler(404, 'Listing not found!'));

    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can only delete your own listing!'))
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing deleted succesfully')

    } catch (error) {
        next(error)
    }
}

const updateUserListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return next(errorHandler(404, 'Listing not found!'));

    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can only update your own listing!'))
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
}

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
}

const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === false) {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === false) {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === false) {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const keyword = req.query.keyword || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: keyword, $options: "i" },
            offer,
            furnished,
            parking,
            type
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        res.status(200).json(listings)
    } catch (err) {
        next(err)
    }
}
module.exports = { createListing, deleteUserListing, updateUserListing, getListing, getListings }