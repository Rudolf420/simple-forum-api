const sequelize = require('./dbConfig.js');
const user = require('./models/Users.js');
const post = require('./models/Posts.js');
const category = require('./models/Categories.js')

const dbUser = user( sequelize );
const dbPost = post( sequelize );
const dbCategory = category( sequelize );

module.exports = {
    user : dbUser,
    post: dbPost,
    category: dbCategory,
};