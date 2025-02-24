const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Resource extends Model {}

Resource.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    contact_info: {
        type: DataTypes.STRING,
    },
    keywords: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    owner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'resource',
});

module.exports = Resource;
