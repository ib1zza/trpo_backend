const Category = require('../models/Category');

// Создать категорию
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании категории', error: error.message });
    }
};

// Получить все категории
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении категорий', error: error.message });
    }
};

// Получить категорию по ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении категории', error: error.message });
    }
};

module.exports = { createCategory, getCategories, getCategoryById };
