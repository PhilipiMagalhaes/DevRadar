const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const parseStringAsArrayLower = require('../utils/parseStringAsArrayLowerCase');

async function verifyDevInDatabase(github_username) {
    const dev = await Dev.findOne({ github_username });
    return dev;
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
        const techsArrayLowerCase = parseStringAsArrayLower(techs);
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
            techsLowerCase: techsArrayLowerCase,
            location
        });

        return response.json({
            result: 'success',
            dev,
        });
    },
    async update(request, response) {
        const { github_username } = request.query;
        let dev = await verifyDevInDatabase(github_username);
        if (!dev)
            return response.json({
                result: 'fail',
                message: 'dev not exist in database',
            });
        
        const { bio = dev.bio, techs=null } = request.body;
        if (techs != null) {
            const techsArray = parseStringAsArray(techs);
            dev.techs = techsArray;
        }
        dev.bio = bio;
       
                
        dev = await Dev.findOneAndUpdate({github_username}, dev);
        return response.json({
            result: 'success',
            message: 'dev informations updated on database'
        });

    },
    async destroy(request, response) {
        const { github_username } = request.query;
        if (await Dev.findOneAndDelete({ github_username })) {            
            return response.json({
                result: 'success',
                message: 'dev deleted from database'
            });
        }        
        else
            return response.json({
                result: 'fail',
                message: 'cannot find dev in database'
            });
    }
}