const express = require('express');
const { createCategory, getCategories, getCategoryById } = require('../controllers/categoryController');

const router = express.Router();

router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);

module.exports = router;
