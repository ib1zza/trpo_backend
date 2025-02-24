const express = require('express');
const { createResource, getResources, getResourceById, updateResource, deleteResource } = require('../controllers/resourceController');

const router = express.Router();

router.post('/resources', createResource);
router.get('/resources', getResources);
router.get('/resources/:id', getResourceById);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

module.exports = router;
