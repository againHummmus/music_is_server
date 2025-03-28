const ErrorMiddleware = require('../error/ErrorMiddleware');
const tokenService = require('../services/tokenService');

const AuthMiddleware = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        if (!token) {
            return next(ErrorMiddleware.unauthorized("Unauthorized"))
        }
        const user = tokenService.validateAccessToken(token)
        console.log(user)
        if (user.role !== "admin") {
            return next(ErrorMiddleware.forbidden("Access denied"))
        }
        req.user = user;

        return next();
    } catch (e) {
        console.log(e)
        return next(ErrorMiddleware.unauthorized("Unauthorized"))
    }
};

module.exports = AuthMiddleware