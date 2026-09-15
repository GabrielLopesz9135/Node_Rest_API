const express = require('express');
const { body } = require('express-validator');
const authController = require('../coontrollers/auth');
const router = express.Router();
const User = require('../model/user')

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            // Custom validation logic for email uniqueness
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('Email address already exists!');
                }
            });
        })
        .normalizeEmail(),
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters long.'),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long.')
], authController.signup);

router.post('/login', authController.login)

module.exports = router;