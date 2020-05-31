const Dev = require('../models/Dev');
parseStringAsArrayLowerCase = require('../utils/parseStringAsArrayLowerCase');
module.exports = {
    async index(request, response) {
        const { longitude, latitude, techs } = request.query;
        const techsArray = parseStringAsArrayLowerCase(techs);

        const devs = await Dev.find({
            techsLowerCase: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });
        if (!devs.length) {
            return response.json(
                {
                    result: 'fail',
                    message: 'no dev found around with these techs'
                })
        }
        return response.json({
            result: 'success',
            devs
        });
    }
}