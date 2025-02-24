const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const resourceUpdateRoutes = require('./routes/resourceUpdateRoutes');  // Подключаем маршруты обновлений
const resourceVisitRoutes = require('./routes/resourceVisitRoutes');  // Подключаем маршруты визитов

const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', resourceRoutes);
app.use('/api', categoryRoutes);
app.use('/api', resourceUpdateRoutes);  // Роуты обновлений
app.use('/api', resourceVisitRoutes);  // Роуты визитов

app.get('/', (req, res) => {
    res.send('API is working!');
});

const { User, Category, Resource, ResourceUpdate, ResourceVisit } = require('./models');


async function resetDatabase() {
    try {
        // 1️⃣ Удаляем все данные из таблиц (CASCADE)
        await sequelize.sync({ force: true });
        console.log('✅ Все таблицы пересозданы (данные удалены).');

        // 2️⃣ Заполняем USERS с реальными ролями
        const users = [
            await User.create({ username: 'alice', email: 'alice@mail.com', password: 'password123', user_type: 'user' }),
            await User.create({ username: 'bob', email: 'bob@mail.com', password: 'password123', user_type: 'resource_owner' }),
            await User.create({ username: 'charlie', email: 'charlie@mail.com', password: 'password123', user_type: 'admin' })
        ];
        for (let i = 4; i <= 10; i++) {
            users.push(await User.create({ username: `user${i}`, email: `user${i}@mail.com`, password: 'password123', user_type: 'user' }));
        }
        console.log('✅ 10 пользователей добавлено.');

        // 3️⃣ Заполняем CATEGORIES с реальными названиями
        const categoryNames = ['Technology', 'Health & Wellness', 'Finance', 'Education', 'Entertainment', 'Sports', 'Travel', 'Food', 'Science', 'Business'];
        const categories = [];
        for (const name of categoryNames) {
            categories.push(await Category.create({ name }));
        }
        console.log('✅ 10 категорий добавлено.');

        // 4️⃣ Заполняем RESOURCES с более реалистичными данными
        const resourceData = [
            { title: 'TechCrunch', url: 'https://techcrunch.com', description: 'Latest technology news and trends', contact_info: 'contact@techcrunch.com', keywords: ['tech', 'news', 'startups'] },
            { title: 'WebMD', url: 'https://www.webmd.com', description: 'Trusted health and wellness information', contact_info: 'support@webmd.com', keywords: ['health', 'medicine', 'wellness'] },
            { title: 'Investopedia', url: 'https://www.investopedia.com', description: 'Finance and investment education', contact_info: 'help@investopedia.com', keywords: ['finance', 'investment', 'economy'] },
            { title: 'Khan Academy', url: 'https://www.khanacademy.org', description: 'Free education for everyone', contact_info: 'support@khanacademy.org', keywords: ['education', 'learning', 'courses'] },
            { title: 'Netflix', url: 'https://www.netflix.com', description: 'Streaming platform for movies and series', contact_info: 'help@netflix.com', keywords: ['movies', 'series', 'entertainment'] },
            { title: 'ESPN', url: 'https://www.espn.com', description: 'Sports news and live scores', contact_info: 'contact@espn.com', keywords: ['sports', 'news', 'live scores'] },
            { title: 'Lonely Planet', url: 'https://www.lonelyplanet.com', description: 'Travel guides and inspiration', contact_info: 'support@lonelyplanet.com', keywords: ['travel', 'guides', 'adventure'] },
            { title: 'Food Network', url: 'https://www.foodnetwork.com', description: 'Recipes and cooking shows', contact_info: 'help@foodnetwork.com', keywords: ['food', 'cooking', 'recipes'] },
            { title: 'NASA', url: 'https://www.nasa.gov', description: 'Space and science exploration', contact_info: 'info@nasa.gov', keywords: ['space', 'science', 'exploration'] },
            { title: 'Forbes', url: 'https://www.forbes.com', description: 'Business and financial news', contact_info: 'support@forbes.com', keywords: ['business', 'finance', 'news'] }
        ];
        const resources = [];
        for (let i = 0; i < resourceData.length; i++) {
            resources.push(await Resource.create({
                ...resourceData[i],
                last_updated: new Date(),
                category_id: categories[i % categories.length].id,
                owner_id: users[(i + 1) % users.length].id
            }));
        }
        console.log('✅ 10 ресурсов добавлено.');

        // 5️⃣ Заполняем RESOURCE_UPDATES
        for (let i = 1; i <= 10; i++) {
            await ResourceUpdate.create({
                resource_id: resources[i % resources.length].id,
                update_description: `Resource update ${i}: Minor fixes and improvements.`
            });
        }
        console.log('✅ 10 обновлений ресурсов добавлено.');

        // 6️⃣ Заполняем RESOURCE_VISITS
        for (let i = 1; i <= 10; i++) {
            await ResourceVisit.create({
                user_id: users[i % users.length].id,
                resource_id: resources[i % resources.length].id
            });
        }
        console.log('✅ 10 посещений ресурсов добавлено.');

        console.log('🎉 База данных успешно заполнена реалистичными тестовыми данными!');
    } catch (error) {
        console.error('❌ Ошибка при заполнении базы:', error);
    } finally {
        await sequelize.close();
    }
}

// resetDatabase();


(async () => {
    try {
        await sequelize.sync();
        console.log('Database synced!');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();
