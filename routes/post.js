require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const Post = require('../models/Post'); // Import the Post model

const router = express.Router();

// Add Post route
router.post('/add', async (req, res) => {
  const { title, url, content } = req.body;
   console.log( title, url, content );
  try {
    const post = new Post({ title, url, content });
    await post.save();
    res.status(201).send({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(400).send({ message: 'Error creating post: ' + err.message });
  }
});

// Get Posts route
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).send({ message: 'Error retrieving posts: ' + err.message });
  }
});

module.exports = router;
