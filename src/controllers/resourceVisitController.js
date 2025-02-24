const ResourceVisit = require('../models/ResourceVisit');

// Создать визит ресурса
const createResourceVisit = async (req, res) => {
    try {
        const { user_id, resource_id } = req.body;
        const visit = await ResourceVisit.create({ user_id, resource_id });
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании визита ресурса', error: error.message });
    }
};

// Получить все визиты
const getResourceVisits = async (req, res) => {
    try {
        const visits = await ResourceVisit.findAll();
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении визитов ресурса', error: error.message });
    }
};

// Получить визиты по ресурсу
const getVisitsByResource = async (req, res) => {
    try {
        const visits = await ResourceVisit.findAll({
            where: { resource_id: req.params.resourceId }
        });
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении визитов ресурса', error: error.message });
    }
};

// Получить визиты по пользователю
const getVisitsByUser = async (req, res) => {
    try {
        const visits = await ResourceVisit.findAll({
            where: { user_id: req.params.userId }
        });
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении визитов пользователя', error: error.message });
    }
};

module.exports = { createResourceVisit, getResourceVisits, getVisitsByResource, getVisitsByUser };
