class ErrorMiddleware extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    static badRequest(message) {
        return new ErrorMiddleware(404, message)
    }
    static internal(message) {
        return new ErrorMiddleware(500, message)
    }
    static forbidden(message) {
        return new ErrorMiddleware(403, message)
    }
    static unauthorized(message)  {
        return new ErrorMiddleware(401, message)
    }
    static success(message) {
        return new ErrorMiddleware(200, message)
    }
}

module.exports = ErrorMiddleware