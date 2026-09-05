const express = require('express')

const feedController = require('../coontrollers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.post('/posts', feedController.postPost);

module.exports = router;