const Controller = require("./controller");
const genreService = require("../services/genreService");
const ErrorMiddleware = require("../error/ErrorMiddleware");

class genreController extends Controller {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const genre = await genreService(req).createGenre({name})
            return res.json(genre)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    async searchGenres(req, res, next) {
        try {
            const { name, limit, offset } = req.query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            const genres = await genreService(req).searchGenres({
                name: name || '',
                limit: parsedLimit,
                offset: parsedOffset,
            });
            return res.json(genres)
        } catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }
}

module.exports = new genreController()
