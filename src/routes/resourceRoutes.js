const express = require('express');
const { createResource, getResources, getResourceById, updateResource, deleteResource, searchResources, refineSearch } = require('../controllers/resourceController');

const router = express.Router();

router.post('/resources', createResource);
router.get('/resources', getResources);
router.get('/resources/category/:categoryId', getResources);
router.get('/resources/:id', getResourceById);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);
router.post('/resources/search', searchResources);
router.post('/resources/refine', refineSearch);


module.exports = router;
