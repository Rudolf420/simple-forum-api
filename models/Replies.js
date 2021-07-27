const { Sequelize, DataTypes } = require('sequelize');

module.exports = function( sequelize ) {
    return sequelize.define('Replies', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        commentid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: 'comments', 
            referencesKey: 'id' 
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: 'users', 
            referencesKey: 'id' 
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        tableName: 'replies',
        timestamps: false
      });
};