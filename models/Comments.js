const { Sequelize, DataTypes } = require('sequelize');

module.exports = function( sequelize ) {
    return sequelize.define('Comments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        postid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: 'posts', 
            referencesKey: 'id' 
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

      }, {
        tableName: 'comments',
        timestamps: false
      });
};