const { Sequelize, DataTypes } = require('sequelize');

module.exports = function( sequelize ) {
    return sequelize.define('Posts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: 'users', 
            referencesKey: 'id' 
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        categoryid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: 'categories', 
            referencesKey: 'id'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
      }, {
        tableName: 'posts',
      });
};