const Joi = require('joi');
const Review = require('./models/Review');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).allow(null),
        price: Joi.number().required().min(0),
        country: Joi.string().required().trim(),
        location: Joi.string().required().trim()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
    
         rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required().trim(),
    }).required()
});