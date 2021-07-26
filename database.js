const sequelize = require('./dbConfig.js');
const user = require('./models/Users.js');
const post = require('./models/Posts.js');
const category = require('./models/Categories.js')
const comment = require('./models/Comments.js')
const reply = require('./models/Replies.js')

const dbUser = user( sequelize );
const dbPost = post( sequelize );
const dbCategory = category( sequelize );
const dbComment = comment( sequelize );
const dbReply = reply( sequelize );

module.exports = {
    user : dbUser,
    post: dbPost,
    category: dbCategory,
    comment: dbComment,
    reply: dbReply,
};