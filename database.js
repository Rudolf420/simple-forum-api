const sequelize = require('./dbConfig.js');
const user = require('./models/Users.js');
const post = require('./models/Posts.js');

const dbUser = user( sequelize );
const dbPost = post( sequelize );

module.exports = {
    user : dbUser,
    post: dbPost,
};