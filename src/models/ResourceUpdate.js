const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ResourceUpdate extends Model {}

ResourceUpdate.init({
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'resources',
            key: 'id',
        },
    },
    update_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    update_description: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize,
    modelName: 'resourceUpdate',
});

module.exports = ResourceUpdate;
