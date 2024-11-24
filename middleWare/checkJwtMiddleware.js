const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // если нет токена

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // если токен не действителен
        req.user = user;
        next();
    });
};