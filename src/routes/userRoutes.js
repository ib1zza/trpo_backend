const express = require('express');
const { createUser, getUsers, getUserById, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users/login', loginUser);


module.exports = router;
