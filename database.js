const sequelize = require('./dbConfig.js');
const user = require('./models/Users.js');

const dbUser = user( sequelize );

module.exports = {
    user : dbUser,
};