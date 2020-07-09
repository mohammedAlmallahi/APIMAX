const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
        const token = req.get('Authorization').split(' ')[1]; // to get value of headers
        let decodedToken; 
        try{
            decodedToken = jwt.verify(token, 'secret');
        }catch (err){
            err.statusCode = 500;
            throw err;
        }

        if(!decodedToken){// which would be the case if it didn't fail technically //but it was unable to verify the token.
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
        }

        req.userId = decodedToken.userId;
        next(); // to countiue to controller
};