const connection = require('mongoose');

connection.connect('YOUR CONNECTION STRING HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

module.exports = connection;