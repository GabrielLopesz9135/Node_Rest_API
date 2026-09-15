const express = require('express')
const { body } = require('express-validator');
const auth = require('../middleware/auth')

const feedController = require('../coontrollers/feed');

const router = express.Router();

router.get('/posts', auth, feedController.getPosts);
router.post('/post', auth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], feedController.postPost);

router.get('/post/:postId', auth, feedController.getPost)

router.put('/post/:postId',auth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], feedController.updatePost)

router.delete('/post/:postId', auth, feedController.deletePost)

module.exports = router;