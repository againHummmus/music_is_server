const ErrorMiddleware = require('../error/ErrorMiddleware');
const tokenService = require('../services/tokenService');

const AdminMiddleware = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return next(ErrorMiddleware.unauthorized("Unauthorized"))
        }
        const user = tokenService.validateAccessToken(token)
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

module.exports = AdminMiddleware