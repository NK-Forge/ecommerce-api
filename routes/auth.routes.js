const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Username, email, and password are required'
    });
  }

  try {
    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: 'A user with that email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser({
      username: username,
      email: email,
      passwordHash: passwordHash
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (err) {
    res.status(500).json({
      message: 'Unable to register user',
      error: err.message
    });
  }
});

module.exports = router;