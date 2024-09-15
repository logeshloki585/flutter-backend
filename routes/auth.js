require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Get JWT secret from environment variables

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user with given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({message:'User already exists'});
    }

    // Create new user if email is not taken
    const user = new User({ email, password });
    await user.save();
    res.status(201).send({message:'User created successfully'});
  } catch (err) {
    res.status(400).send({message:'Error registering user: ' + err.message});
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({message:'Invalid credentials'});
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).send({message:'Error signing in: ' + err.message});
  }
});

module.exports = router;
