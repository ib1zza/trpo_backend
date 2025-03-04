const User = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Create a new user
const createUser = async (req, res) => {
  try {
    const { email, password, user_type } = req.body;
    const approved = false;

    const user = await User.create({ email, password, user_type, approved });
    res.status(201).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.update({ approved: true }, { where: { email } });
    res.status(201).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Login user by email and password
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.scope("withPassword").findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(password, user.password, user);

    // Compare provided password with stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If authentication is successful, return user data (could also include JWT token here)
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Создаём папку для загрузки, если её нет
const uploadDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Эндпоинт для загрузки аватара
const uploadAvatar = async (req, res) => {
  try {
    // Проверяем, был ли загружен файл
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // get id from formdata
    const user = await User.findByPk(req.body.id);
    if (!user) return res.status(404).json({ message: "User  not found" });

    // Удаляем старый аватар, если он существует
    if (user.avatar_url) {
      const oldPath = path.join(uploadDir, path.basename(user.avatar_url));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Сохраняем новый путь к аватару
    user.avatar_url = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      avatar_url: user.avatar_url,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error); // Логируем ошибку для отладки
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

// 🔹 Эндпоинт для получения аватара пользователя
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "user_type", "avatar_url"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  loginUser,
  verifyUser,
  uploadAvatar,
  getUserProfile,
};
