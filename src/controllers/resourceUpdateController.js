const ResourceUpdate = require('../models/ResourceUpdate');

// Создать обновление ресурса
const createResourceUpdate = async (req, res) => {
    try {
        const { resource_id, update_description } = req.body;
        const update = await ResourceUpdate.create({ resource_id, update_description });
        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании обновления ресурса', error: error.message });
    }
};

// Получить все обновления ресурса
const getResourceUpdates = async (req, res) => {
    try {
        const updates = await ResourceUpdate.findAll();
        res.status(200).json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении обновлений ресурса', error: error.message });
    }
};

// Получить обновления по ресурсу
const getUpdatesByResource = async (req, res) => {
    try {
        const updates = await ResourceUpdate.findAll({
            where: { resource_id: req.params.resourceId }
        });
        res.status(200).json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении обновлений ресурса', error: error.message });
    }
};

module.exports = { createResourceUpdate, getResourceUpdates, getUpdatesByResource };
