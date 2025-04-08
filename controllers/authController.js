const userService = require('../services/authService');
const bcrypt = require('bcrypt');

const getRegister = (req, res) => {
  res.render('register', {
    user: req.user,
    error: null,
    success: null,
  });
};

const postRegister = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('register', {
      user: req.user,
      error: 'Username and password are required.',
      success: null,
    });
  }

  if (username.length < 3 || username.length > 20) {
    return res.render('register', {
      user: req.user,
      error: 'Username must be between 3 and 20 characters.',
      success: null,
    });
  }

  if (password.length < 6) {
    return res.render('register', {
      user: req.user,
      error: 'Password must be at least 6 characters long.',
      success: null,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { token, user } = await userService.registerUser(username, hashedPassword);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.render('index', {
      user,
      error: null,
      success: 'Registration successful! You are now logged in.',
    });
  } catch (err) {
    res.render('register', {
      user: req.user,
      error: err.message || 'Error registering user.',
      success: null,
    });
  }
};

const getLogin = (req, res) => {
  res.render('login', {
    user: req.user,
    error: null,
    success: null,
  });
};

const postLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', {
      user: req.user,
      error: 'Username and password are required.',
      success: null,
    });
  }

  try {
    const { token, user } = await userService.loginUser(username, password);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.render('index', {
      user,
      error: null,
      success: 'Login successful!',
    });
  } catch (err) {
    res.render('login', {
      user: req.user,
      error: err.message || 'Error logging in.',
      success: null,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.render('index', {
    user: null,
    error: null,
    success: 'Logged out successfully!',
  });
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };