const express = require("express");
const cors = require("cors"); // Add this line
const sequelize = require("./db");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const resourceUpdateRoutes = require("./routes/resourceUpdateRoutes"); // Подключаем маршруты обновлений
const resourceVisitRoutes = require("./routes/resourceVisitRoutes"); // Подключаем маршруты визитов
const path = require("path");

const app = express();
app.use(cors()); // Add this line
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", resourceRoutes);
app.use("/api", categoryRoutes);
app.use("/api", resourceUpdateRoutes); // Роуты обновлений
app.use("/api", resourceVisitRoutes); // Роуты визитов

app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars"))
);

app.get("/", (req, res) => {
  res.send("API is working!");
});

module.exports = app;

const {
  User,
  Category,
  Resource,
  ResourceUpdate,
  ResourceVisit,
} = require("./models");

async function resetDatabase() {
  try {
    // 1️⃣ Удаляем все данные из таблиц (CASCADE)
    await sequelize.sync({ force: true });
    console.log("✅ Все таблицы пересозданы (данные удалены).");

    // 2️⃣ Заполняем USERS с реальными ролями
    const users = [
      await User.create({
        username: "alice",
        email: "alice@mail.com",
        password: "password123",
        user_type: "user",
      }),
      await User.create({
        username: "bob",
        email: "bob@mail.com",
        password: "password123",
        user_type: "resource_owner",
      }),
      await User.create({
        username: "charlie",
        email: "charlie@mail.com",
        password: "password123",
        user_type: "admin",
      }),
    ];
    for (let i = 4; i <= 10; i++) {
      users.push(
        await User.create({
          username: `user${i}`,
          email: `user${i}@mail.com`,
          password: "password123",
          user_type: "user",
        })
      );
    }
    console.log("✅ 10 пользователей добавлено.");

    // 3️⃣ Заполняем CATEGORIES с реальными названиями
    const categoryNames = [
      "Technology",
      "Health & Wellness",
      "Finance",
      "Education",
      "Entertainment",
      "Sports",
      "Travel",
      "Food",
      "Science",
      "Business",
    ];
    const categories = [];
    for (const name of categoryNames) {
      categories.push(await Category.create({ name }));
    }
    console.log("✅ 10 категорий добавлено.");

    // 4️⃣ Заполняем RESOURCES с более реалистичными данными
    const resourceData = [
      {
        title: "TechCrunch",
        url: "https://techcrunch.com",
        description: "Latest technology news and trends",
        contact_info: "contact@techcrunch.com",
        keywords: ["tech", "news", "startups"],
      },
      {
        title: "WebMD",
        url: "https://www.webmd.com",
        description: "Trusted health and wellness information",
        contact_info: "support@webmd.com",
        keywords: ["health", "medicine", "wellness"],
      },
      {
        title: "Investopedia",
        url: "https://www.investopedia.com",
        description: "Finance and investment education",
        contact_info: "help@investopedia.com",
        keywords: ["finance", "investment", "economy"],
      },
      {
        title: "Khan Academy",
        url: "https://www.khanacademy.org",
        description: "Free education for everyone",
        contact_info: "support@khanacademy.org",
        keywords: ["education", "learning", "courses"],
      },
      {
        title: "Netflix",
        url: "https://www.netflix.com",
        description: "Streaming platform for movies and series",
        contact_info: "help@netflix.com",
        keywords: ["movies", "series", "entertainment"],
      },
      {
        title: "ESPN",
        url: "https://www.espn.com",
        description: "Sports news and live scores",
        contact_info: "contact@espn.com",
        keywords: ["sports", "news", "live scores"],
      },
      {
        title: "Lonely Planet",
        url: "https://www.lonelyplanet.com",
        description: "Travel guides and inspiration",
        contact_info: "support@lonelyplanet.com",
        keywords: ["travel", "guides", "adventure"],
      },
      {
        title: "Food Network",
        url: "https://www.foodnetwork.com",
        description: "Recipes and cooking shows",
        contact_info: "help@foodnetwork.com",
        keywords: ["food", "cooking", "recipes"],
      },
      {
        title: "NASA",
        url: "https://www.nasa.gov",
        description: "Space and science exploration",
        contact_info: "info@nasa.gov",
        keywords: ["space", "science", "exploration"],
      },
      {
        title: "Forbes",
        url: "https://www.forbes.com",
        description: "Business and financial news",
        contact_info: "support@forbes.com",
        keywords: ["business", "finance", "news"],
      },
    ];
    const resources = [];
    for (let i = 0; i < resourceData.length; i++) {
      resources.push(
        await Resource.create({
          ...resourceData[i],
          last_updated: new Date(),
          category_id: categories[i % categories.length].id,
          owner_id: users[(i + 1) % users.length].id,
        })
      );
    }
    console.log("✅ 10 ресурсов добавлено.");

    // 5️⃣ Заполняем RESOURCE_UPDATES
    for (let i = 1; i <= 10; i++) {
      await ResourceUpdate.create({
        resource_id: resources[i % resources.length].id,
        update_description: `Resource update ${i}: Minor fixes and improvements.`,
      });
    }
    console.log("✅ 10 обновлений ресурсов добавлено.");

    // 6️⃣ Заполняем RESOURCE_VISITS
    for (let i = 1; i <= 10; i++) {
      await ResourceVisit.create({
        user_id: users[i % users.length].id,
        resource_id: resources[i % resources.length].id,
      });
    }
    console.log("✅ 10 посещений ресурсов добавлено.");

    console.log(
      "🎉 База данных успешно заполнена реалистичными тестовыми данными!"
    );
  } catch (error) {
    console.error("❌ Ошибка при заполнении базы:", error);
  } finally {
    await sequelize.close();
  }
}

async function addMoreResources() {
  try {
    // Получаем все категории и пользователей
    const categories = await Category.findAll();
    const users = await User.findAll();

    // Данные для новых ресурсов
    const additionalResourceData = [
      // Технологии
      [
        // {
        //   title: "Wired",
        //   url: "https://www.wired.com",
        //   description:
        //     "In-depth coverage of current and future trends in technology.",
        //   contact_info: "editor@wired.com",
        //   keywords: ["technology", "trends", "innovation"],
        // },
        // {
        //   title: "The Verge",
        //   url: "https://www.theverge.com",
        //   description:
        //     "The intersection of technology, science, art, and culture.",
        //   contact_info: "contact@theverge.com",
        //   keywords: ["tech", "culture", "science"],
        // },
        // {
        //   title: "TechRadar",
        //   url: "https://www.techradar.com",
        //   description: "The latest technology news and reviews.",
        //   contact_info: "support@techradar.com",
        //   keywords: ["reviews", "news", "technology"],
        // },
        // {
        //   title: "CNET",
        //   url: "https://www.cnet.com",
        //   description: "Product reviews, how-tos, and the latest tech news.",
        //   contact_info: "help@cnet.com",
        //   keywords: ["reviews", "tech", "news"],
        // },
        // {
        //   title: "Gizmodo",
        //   url: "https://gizmodo.com",
        //   description: "Design, technology, and science news.",
        //   contact_info: "tips@gizmodo.com",
        //   keywords: ["design", "technology", "science"],
        // },
      ],
      // Здоровье и благополучие
      [
        // {
        //   title: "Mayo Clinic",
        //   url: "https://www.mayoclinic.org",
        //   description: "Trusted health information and resources.",
        //   contact_info: "info@mayoclinic.org",
        //   keywords: ["health", "wellness", "medical"],
        // },
        // {
        //   title: "Healthline",
        //   url: "https://www.healthline.com",
        //   description: "Health information and news.",
        //   contact_info: "contact@healthline.com",
        //   keywords: ["health", "news", "wellness"],
        // },
        // {
        //   title: "Verywell Health",
        //   url: "https://www.verywellhealth.com",
        //   description: "Health information and advice.",
        //   contact_info: "support@verywell.com",
        //   keywords: ["health", "advice", "wellness"],
        // },
        // {
        //   title: "WebMD",
        //   url: "https://www.webmd.com",
        //   description: "Trusted health and wellness information.",
        //   contact_info: "support@webmd.com",
        //   keywords: ["health", "medicine", "wellness"],
        // },
        // {
        //   title: "NHS",
        //   url: "https://www.nhs.uk",
        //   description: "National Health Service in the UK.",
        //   contact_info: "contact@nhs.uk",
        //   keywords: ["health", "government", "wellness"],
        // },
      ],
      // Финансы
      [
        // {
        //   title: "Bloomberg",
        //   url: "https://www.bloomberg.com",
        //   description: "Global business and financial news.",
        //   contact_info: "info@bloomberg.com",
        //   keywords: ["finance", "business", "news"],
        // },
        // {
        //   title: "Yahoo Finance",
        //   url: "https://finance.yahoo.com",
        //   description: "Financial news, data, and insights.",
        //   contact_info: "support@finance.yahoo.com",
        //   keywords: ["finance", "news", "data"],
        // },
        // {
        //   title: "CNBC",
        //   url: "https://www.cnbc.com",
        //   description: "Business news and financial information.",
        //   contact_info: "contact@cnbc.com",
        //   keywords: ["business", "finance", "news"],
        // },
        // {
        //   title: "MarketWatch",
        //   url: "https://www.marketwatch.com",
        //   description: "Financial information and business news.",
        //   contact_info: "support@marketwatch.com",
        //   keywords: ["finance", "business", "news"],
        // },
        // {
        //   title: "The Motley Fool",
        //   url: "https://www.fool.com",
        //   description: "Investment advice and stock market news.",
        //   contact_info: "help@fool.com",
        //   keywords: ["investing", "finance", "advice"],
        // },
      ],
      // Образование
      [
        // {
        //   title: "Coursera",
        //   url: "https://www.coursera.org",
        //   description: "Online courses from top universities.",
        //   contact_info: "support@coursera.org",
        //   keywords: ["education", "online courses", "learning"],
        // },
        // {
        //   title: "edX",
        //   url: "https://www.edx.org",
        //   description: "Free online courses from universities.",
        //   contact_info: "info@edx.org",
        //   keywords: ["education", "courses", "learning"],
        // },
        // {
        //   title: "Udacity",
        //   url: "https://www.udacity.com",
        //   description: "Nanodegree programs in tech fields.",
        //   contact_info: "support@udacity.com",
        //   keywords: ["education", "tech", "nanodegree"],
        // },
        // {
        //   title: "Khan Academy",
        //   url: "https://www.khanacademy.org",
        //   description: "Free education for everyone.",
        //   contact_info: "support@khanacademy.org",
        //   keywords: ["education", "learning", "courses"],
        // },
        {
          title: "Skillshare",
          url: "https://www.skillshare.com",
          description: "Online learning community.",
          contact_info: "support@skillshare.com",
          keywords: ["education", "learning", "community"],
        },
      ],
      // Развлечения
      [
        {
          title: "Hulu",
          url: "https://www.hulu.com",
          description: "Streaming service for TV shows and movies.",
          contact_info: "support@hulu.com",
          keywords: ["streaming", "movies", "TV"],
        },
        {
          title: "YouTube",
          url: "https://www.youtube.com",
          description: "Video sharing platform.",
          contact_info: "support@youtube.com",
          keywords: ["video", "entertainment", "streaming"],
        },
        {
          title: "IMDb",
          url: "https://www.imdb.com",
          description: "Movie and TV database.",
          contact_info: "support@imdb.com",
          keywords: ["movies", "TV", "database"],
        },
        {
          title: "Rotten Tomatoes",
          url: "https://www.rottentomatoes.com",
          description: "Movie and TV reviews.",
          contact_info: "support@rottentomatoes.com",
          keywords: ["movies", "reviews", "entertainment"],
        },
        {
          title: "Spotify",
          url: "https://www.spotify.com",
          description: "Music streaming service.",
          contact_info: "support@spotify.com",
          keywords: ["music", "streaming", "entertainment"],
        },
      ],
    ];

    // Добавляем ресурсы в базу данных
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const resources = additionalResourceData[i];

      for (const resource of resources) {
        await Resource.create({
          ...resource,
          last_updated: new Date(),
          category_id: category.id,
          owner_id: users[Math.floor(Math.random() * users.length)].id,
        });
      }
    }

    console.log("✅ 25 новых ресурсов добавлено (по 5 в каждую категорию).");
  } catch (error) {
    console.error("❌ Ошибка при добавлении ресурсов:", error);
  } finally {
    await sequelize.close();
  }
}

// addMoreResources();
resetDatabase();

// Удалит и пересоздаст все таблицы

(async () => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });
    console.log("Database synced!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();
