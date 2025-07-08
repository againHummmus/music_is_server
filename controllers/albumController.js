const ErrorMiddleware = require("../error/ErrorMiddleware");
const albumService = require ("../services/albumService")
const Controller = require("./controller");

class albumController extends Controller {
    async create(req, res, next) {
        try {
            const { name, year, artistId } = req.body
            const { image } = req.files
            const data = await albumService(req).createAlbum({name, year, artistId, image})
            return res.json(data)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }


    async searchAlbums(req, res, next) {
        try {
            const { id, name, artistId, limit, offset } = req.query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            const albums = await albumService(req).searchAlbums({
                id: id,
                name: name || '',
                artistId: artistId || '',
                limit: parsedLimit,
                offset: parsedOffset,
            });
            return res.json(albums);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

}

module.exports = new albumController()
