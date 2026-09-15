const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.get('Authorization').split(' ')[1];
        if(!token){
            const error = new Error('Not Authenticated.');
            error.statusCode = 401;
            throw error;
        }
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            const error = new Error('Not Authenticated.');
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    }catch(err){
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
};