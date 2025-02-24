const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ResourceVisit extends Model {}

ResourceVisit.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'resources',
            key: 'id',
        },
    },
    visit_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'resourceVisit',
});

module.exports = ResourceVisit;
