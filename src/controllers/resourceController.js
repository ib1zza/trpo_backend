const Resource = require('../models/Resource');
const { Op } = require('sequelize');

// Search resources by keywords
const searchResources = async (req, res) => {
    try {
        const { query, sortBy } = req.body;
        if (!query || query.length === 0) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const resources = await Resource.findAll({
            where: {
                keywords: {
                    [Op.overlap]: query, // Searching for resources containing any of the keywords
                },
            },
        });

        // Calculate relevance score (count of matching keywords)
        const scoredResources = resources.map(resource => {
            const relevance = resource.keywords.filter(keyword => query.includes(keyword)).length;
            return { ...resource.toJSON(), relevance };
        });

        // Sorting
        if (sortBy === 'relevance') {
            scoredResources.sort((a, b) => b.relevance - a.relevance);
        } else if (sortBy === 'date') {
            scoredResources.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
        }

        res.status(200).json(scoredResources);
    } catch (error) {
        res.status(500).json({ message: 'Error searching resources', error: error.message });
    }
};

// Refine search within previous results
const refineSearch = async (req, res) => {
    try {
        const { previousResults, query, sortBy } = req.body;
        if (!previousResults || previousResults.length === 0) {
            return res.status(400).json({ message: 'No previous search results provided' });
        }
        if (!query || query.length === 0) {
            return res.status(400).json({ message: 'Refinement query is required' });
        }

        // Filter previous results
        const refinedResults = previousResults.filter(resource =>
            resource.keywords.some(keyword => query.includes(keyword))
        );

        // Calculate relevance score
        const scoredResources = refinedResults.map(resource => {
            const relevance = resource.keywords.filter(keyword => query.includes(keyword)).length;
            return { ...resource, relevance };
        });

        // Sorting
        if (sortBy === 'relevance') {
            scoredResources.sort((a, b) => b.relevance - a.relevance);
        } else if (sortBy === 'date') {
            scoredResources.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
        }

        res.status(200).json(scoredResources);
    } catch (error) {
        res.status(500).json({ message: 'Error refining search', error: error.message });
    }
};


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
        const categoryId = req.params.categoryId;

        if (categoryId) {
            const resources = await Resource.findAll({
                where: {
                    category_id: categoryId
                }
            });
            res.status(200).json(resources);
        } else {
            const resources = await Resource.findAll();
            res.status(200).json(resources);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
};

const getResourcesByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const resources = await Resource.findAll({
            where: {
                category_id: categoryId
            }
        });

        if (!resources || resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this category' });
        }

        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources by category', error: error.message });
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

module.exports = { createResource, getResources, getResourceById, updateResource, deleteResource, searchResources, refineSearch };
