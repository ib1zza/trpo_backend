require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'my_user',
        password: process.env.DB_PASSWORD || 'my_password',
        database: process.env.DB_NAME || 'my_database',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432
    },
    // можно добавить другие конфигурации для продакшн и тестирования
};
