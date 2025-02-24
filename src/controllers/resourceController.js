const Resource = require('../models/Resource');

// Create a new resource
const createResource = async (req, res) => {
    try {
        const { title, url, description, category_id, owner_id, contact_info, keywords } = req.body;

        const resource = await Resource.create({
            title,
            url,
            description,
            category_id,
            owner_id,
            contact_info,
            keywords,
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resource', error: error.message });
    }
};

// Get all resources
const getResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
};

// Get a specific resource by ID
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resource', error: error.message });
    }
};

// Update a resource
const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const { title, url, description, category_id, owner_id, contact_info, keywords } = req.body;
        resource.title = title || resource.title;
        resource.url = url || resource.url;
        resource.description = description || resource.description;
        resource.category_id = category_id || resource.category_id;
        resource.owner_id = owner_id || resource.owner_id;
        resource.contact_info = contact_info || resource.contact_info;
        resource.keywords = keywords || resource.keywords;
        resource.last_updated = new Date();

        await resource.save();

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Error updating resource', error: error.message });
    }
};

// Delete a resource
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resource.destroy();
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resource', error: error.message });
    }
};

module.exports = { createResource, getResources, getResourceById, updateResource, deleteResource };
