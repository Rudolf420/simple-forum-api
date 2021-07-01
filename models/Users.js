const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbConfig.js');

module.exports = function( sequelize ) {
    return sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        e_mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        registration_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
      }, {
        tableName: 'users'
      });
};