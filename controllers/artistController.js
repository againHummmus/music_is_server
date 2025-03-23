const ErrorMiddleware = require("../error/ErrorMiddleware");
const artistService = require("../services/artistService");
const Controller = require("./controller");

class artistController extends Controller {
    async create(req, res, next) {
        try {
            const { name, userId } = req.body;
            const { image } = req.files;
            const artist = await artistService.createArtist({ name, image, userId });
            return res.json(artist);
        } catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const artists = await artistService.getAllArtists();
            return res.json(artists);
        } catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const artist = await artistService.getOneArtist({id})
            return res.json(artist)
        }
        catch(error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getOneByName(req, res, next) {
        try {
            const {name} = req.params
            const artist = await artistService.getOneArtistByName({name})
            return res.json(artist)
        }
        catch(error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }
}

module.exports = new artistController();
