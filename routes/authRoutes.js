const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

// Register routes
router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);

// Login routes
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

// Logout route
router.get('/logout', userController.logout);

module.exports = router;