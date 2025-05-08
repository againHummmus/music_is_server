const ErrorMiddleware = require("../error/ErrorMiddleware");
const artistService = require("../services/artistService");
const Controller = require("./controller");

class artistController extends Controller {
    async create(req, res, next) {
        try {
            const { name, userId } = req.body;
            const { image } = req.files;
            const artist = await artistService(req).createArtist({ name, image, userId });
            return res.json(artist);
        } catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async searchArtists(req, res, next) {
        try {
            const { name, limit, offset } = req.query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            const artists = await artistService(req).searchArtists({
                name: name || '',
                limit: parsedLimit,
                offset: parsedOffset,
            });
            return res.json(artists)
        } catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

}

module.exports = new artistController();
