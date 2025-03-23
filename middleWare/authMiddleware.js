const jwt = require('jsonwebtoken');
const ErrorMiddleware = require('../error/ErrorMiddleware');
const tokenService = require('../services/tokenService');

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(ErrorMiddleware.unauthorized("Unauthorized"))
        }
        const user = tokenService.validateAccessToken(token)
        if (!user) {
            return next(ErrorMiddleware.unauthorized("Unauthorized"))
        }
        req.user = user;

        return next();
    } catch (e) {
        return next(ErrorMiddleware.unauthorized("Unauthorized"))
    }
};