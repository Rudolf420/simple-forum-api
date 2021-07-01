const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('d329cb7javqalt', 'nzhpdzbolkbetq', '804f2175b49bd594d19b533ee0d2a87be3c057e38562ad9b80e69c8c5af7211d', {
    host: 'ec2-54-220-53-223.eu-west-1.compute.amazonaws.com',
    dialect: "postgres",
    dialectOptions: {
        "ssl": true
    },

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;