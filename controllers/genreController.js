const ApiError = require("../error/ApiError");
const genreService = require("../services/genreService")
const artistService = require("../services/artistService");
class genreController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const genre = await genreService.createGenre({name})
            return res.json(genre)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }
    async getAll(req, res, next) {
        try {
            const genres = await genreService.getAllGenres()
            return res.json(genres)
        }
        catch(error)
        {
            return next(ApiError.internal("Internal error"))
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
            return next(ApiError.internal(("Internal error")))
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
            return next(ApiError.internal(("Internal error")))
        }
    }
}

module.exports = new genreController()
