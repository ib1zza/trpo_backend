const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  loginUser,
  verifyUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users/login", loginUser);
router.post("/users/verify", verifyUser);

module.exports = router;
