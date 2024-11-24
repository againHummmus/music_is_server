const artistService = require("../services/artistService");
const ApiError = require("../error/ApiError");
const albumService = require("../services/albumService");

class ArtistController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const { image } = req.files;
            const artist = await artistService.createArtist({ name, image });
            return res.json(artist);
        } catch (error) {
            console.error(error);
            return next(ApiError.internal(('Internal error')));
        }
    }

    async getAll(req, res, next) {
        try {
            const artists = await artistService.getAllArtists();
            return res.json(artists);
        } catch (error) {
            console.error(error);
            return next(ApiError.internal(('Internal error')));
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
            return next(ApiError.internal(("Internal error")))
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
            return next(ApiError.internal(("Internal error")))
        }
    }
}

module.exports = new ArtistController();
