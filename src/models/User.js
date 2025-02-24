const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
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
}, {
    // Скрытие пароля по умолчанию при запросах
    defaultScope: {
        attributes: { exclude: ['password'] }, // Исключаем поле password из ответа
    },
    // Если вы хотите разрешить выборку пароля в отдельных запросах, можно создать другие скоупы:
    scopes: {
        withPassword: {
            attributes: { include: ['password'] } // Включаем password для определенных запросов
        }
    }
});

// Хеширование пароля перед сохранением пользователя
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10); // Генерация соли для хеширования
    user.password = await bcrypt.hash(user.password, salt); // Хеширование пароля
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) { // Проверка, изменился ли пароль
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

module.exports = User;
