const { Sequelize, DataTypes } = require('sequelize');

module.exports = function( sequelize ) {
    return sequelize.define('Categories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        post_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: false
        }
      }, {
        tableName: 'categories',
        timestamps: false
      });
};