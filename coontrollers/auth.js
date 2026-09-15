const User = require('../model/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const hashPassword = await bcrypt.hash(password, 12)
        const user = new User({
            name: name,
            email: email,
            password: hashPassword
        })

        const result = await user.save();

        res.status(201).json({message: 'User Created', userId: result._id})

    }catch(err){
        console.log(err);
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }  
}

exports.login = async (req, res, next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email: email});

        if(!user){
            const error = new Error('Unable to find a user with those credencials');
            error.statusCode = 400;
            throw error;
        }

        const passwordIsEqual = await bcrypt.compare(password, user.password);
        if(!passwordIsEqual){
            const error = new Error('Invalid Credencials');
            error.statusCode = 405;
            throw error;
        }

        const token = jwt.sign({
            email: user.email, 
            userId: user._id.toString()
        }, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.status(200).json({token: token, userId: user._id.toString()})

    }catch(err){
        console.log(err);
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }  
}