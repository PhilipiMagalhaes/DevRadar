const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

async function verifyDevInDatabase(github_username) {
    const exist = await Dev.findOne({ github_username });
    if (!exist)
        return false;
    else
        return true;
}

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        response.json(devs);
    },
    async store(request, response) {
        const { github_username, techs, longitude, latitude } = request.body;

        if (await verifyDevInDatabase(github_username)) {
            return response.json({
                result: 'fail',
                message: 'dev already registered with this github username'
            });
        }
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        const { name = login, avatar_url, bio } = apiResponse.data;
        const techsArray = parseStringAsArray(techs);
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
        const dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        });

        return response.json({
            result: 'success',
            dev
        });
    },
    async update(request, response) {
        
    }
}