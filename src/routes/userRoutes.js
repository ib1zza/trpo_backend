const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  loginUser,
  verifyUser,
  uploadAvatar,
  getUserProfile,
} = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Создаём папку для загрузки, если её нет
const uploadDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настроим `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log(req);
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users/login", loginUser);
router.post("/users/verify", verifyUser);

router.post("/users/upload-avatar", upload.single("avatar"), uploadAvatar);
// router.get("/:id", getUserProfile);

module.exports = router;
