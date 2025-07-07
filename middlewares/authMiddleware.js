const ErrorMiddleware = require('../error/ErrorMiddleware');
const tokenService = require('../services/tokenService');

const AuthMiddleware = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.cookies.access_token;
        if (!token) {
            console.error("no token!")
            return next(ErrorMiddleware.unauthorized("Unauthorized - no token"));
        }
        const user = tokenService.validateaccess_token(token);
        if (!user) {
            console.error("no user!")
            return next(ErrorMiddleware.unauthorized("Unauthorized - no user"));
        }
        req.user = user;
        return next();
    } catch (e) {
        console.log(e)
        return next(ErrorMiddleware.unauthorized("Unauthorized"));
    }
};

module.exports = AuthMiddleware;
