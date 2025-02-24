const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { email, password, user_type, approved } = req.body;

        const user = await User.create({ email, password, user_type, approved });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Login user by email and password
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.scope('withPassword').findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(password, user.password, user);

        // Compare provided password with stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If authentication is successful, return user data (could also include JWT token here)
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


module.exports = { createUser, getUsers, getUserById, loginUser };
