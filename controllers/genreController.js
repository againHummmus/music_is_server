const Controller = require("./controller");
const genreService = require("../services/genreService");
const ErrorMiddleware = require("../error/ErrorMiddleware");

class genreController extends Controller {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const genre = await genreService.createGenre({name})
            return res.json(genre)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    async getAll(req, res, next) {
        try {
            const genres = await genreService.getAllGenres()
            return res.json(genres)
        }
        catch(error)
        {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const genre = await genreService.getOneGenre({id})
            return res.json(genre)
        }
        catch(error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getOneByName(req, res, next) {
        try {
            const {name} = req.params
            const genre = await genreService.getOneGenreByName({name})
            return res.json(genre)
        }
        catch(error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }
}

module.exports = new genreController()
