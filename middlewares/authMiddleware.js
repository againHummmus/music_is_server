const ErrorMiddleware = require('../error/ErrorMiddleware');
const tokenService = require('../services/tokenService');

const AuthMiddleware = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return next(ErrorMiddleware.unauthorized("Unauthorized"));
        }
        const user = tokenService.validateAccessToken(token);
        if (!user) {
            return next(ErrorMiddleware.unauthorized("Unauthorized"));
        }
        req.user = user;
        return next();
    } catch (e) {
        return next(ErrorMiddleware.unauthorized("Unauthorized"));
    }
};

module.exports = AuthMiddleware;
