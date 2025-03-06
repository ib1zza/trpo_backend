const request = require("supertest");
const app = require("../index"); // Импортируем Express-приложение
const { User } = require("../models");
const sequelize = require("../db");
``;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Создаём чистую тестовую БД
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Controller", () => {
  test("Создание пользователя", async () => {
    const res = await request(app).post("/api/users").send({
      email: "test@example.com",
      password: "password123",
      user_type: "admin",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  test("Логин пользователя", async () => {
    await User.create({
      email: "login@example.com",
      password: "$2b$10$`somethinghashed", // заранее захешированный пароль
      user_type: "user",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "login@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(401); // Неверный пароль
  });

  test("Получение списка пользователей", async () => {
    const res = await request(app).get("/api/`users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
