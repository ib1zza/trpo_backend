const express = require("express");
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources,
  refineSearch,
  changeResourceOwner, // Импортируем новый контроллер
} = require("../controllers/resourceController");

const router = express.Router();

// Создание ресурса
router.post("/resources", createResource);

// Получение ресурсов
router.get("/resources", getResources);
router.get("/resources/category/:categoryId", getResources);
router.get("/resources/user/:userId", getResources);

// Получение, обновление и удаление ресурса по ID
router.get("/resources/:id", getResourceById);
router.put("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);

// Поиск и уточнение поиска ресурсов
router.post("/resources/search", searchResources);
router.post("/resources/refine", refineSearch);

// Изменение владельца ресурса по URL
router.put("/resources/update/change-owner", changeResourceOwner); // Добавляем новый маршрут

module.exports = router;
