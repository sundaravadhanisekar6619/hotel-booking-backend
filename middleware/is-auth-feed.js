const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader){
        // const error = new Error('Not authentication.');
        // error.statusCode = 401;
        // throw error;
        return res.status(401).json({ message: 'Not authenticated!'});
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'supersecret_dont_share');
    }
    catch (err) {
        // err.statusCode = 500;
        // throw err;
        return res.status(500).json({ message: err});
    }
    if (!decodedToken){
        // const error = new Error('Not authentication.');
        // error.statusCode = 401;
        // throw error;
        return res.status(401).json({ message: 'Not authenticated!'});
    }
    req.userId = decodedToken.userId;
    req.lineId = decodedToken.email;
    next();

};