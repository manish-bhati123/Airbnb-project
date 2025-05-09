const Joi = require('joi');

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