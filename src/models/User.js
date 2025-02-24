const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['user', 'resource_owner', 'admin']]
        }
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = User;
