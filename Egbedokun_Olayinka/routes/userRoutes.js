const express = require("express");
const router = express.Router();

const UserController = require('../controllers/userController');

// show login page
router.get("/login", UserController.showLogin);

// show register page
router.get("/register", UserController.showRegister);

// login functionality
router.post('/login', UserController.handleLogin);

// register functionality
router.post('/register', UserController.handleRegister);

// logout
router.get('/logout', UserController.handleLogout);

module.exports = router;
