const ErrorMiddleware = require("../error/ErrorMiddleware");
const trackService = require("../services/trackService");
const Controller = require("./controller");

class trackController extends Controller {
    async create(req, res, next) {
        try {
            const { genreId, artistId, albumId, name, lyrics } = req.body;
            const { file } = req.files;
    
            const track = await trackService.createTrack({
                genreId,
                artistId,
                albumId,
                name,
                file,
                lyrics
            });
    
            return res.json(track);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message));
        }
    }

    async search(req, res, next) {
        try {
            const { id, genre, artist, album, likedByUserId, name, limit, offset } = req.query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            
            const tracks = await trackService.searchTracks({
                id: id || undefined,
                genre: genre || undefined,
                artist: artist || undefined,
                album: album || undefined,
                likedByUserId: likedByUserId || undefined,
                name: name || undefined,
                limit: parsedLimit,
                offset: parsedOffset,
            });
            return res.json(tracks);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message));
        }
    }
}

module.exports = new trackController();
