const ErrorMiddleware = require("../error/ErrorMiddleware");
const trackService = require("../services/trackService");
const Controller = require("./controller");

class trackController extends Controller {
    async create(req, res, next) {
        try {
            const { genreId, artistId, albumId, name, lyrics, isAddedByUser } = req.body;
            const { file } = req.files;
            const track = await trackService(req).createTrack({
                genreId,
                artistId,
                albumId,
                name,
                file,
                lyrics,
                isAddedByUser
            });

            return res.json(track);
        } catch (error) {
            if (error instanceof ErrorMiddleware) {
                return next(error);
            }
            return next(ErrorMiddleware.internal(error.message));
        }
    }

    async search(req, res, next) {
        try {
            const { id, genre, artist, album, likedByUserId, name, limit, offset, sortByLikes } = req.query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            const parsedSortByLikes = sortByLikes ? (sortByLikes === 'true') : false;

            const tracks = await trackService(req).searchTracks({
                id: id || undefined,
                genre: genre || undefined,
                artist: artist || undefined,
                album: album || undefined,
                likedByUserId: likedByUserId || undefined,
                name: name || undefined,
                limit: parsedLimit,
                offset: parsedOffset,
                sortByLikes: parsedSortByLikes,
            });
            return res.json(tracks);
        } catch (error) {
            if (error instanceof ErrorMiddleware) {
                return next(error);
            }
            return next(ErrorMiddleware.internal(error.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { trackId } = req.params;
            
            if (!trackId) {
                return next(ErrorMiddleware.badRequest('Track ID is required.'));
            }

            const deletedTrack = await trackService(req).deleteTrack({
                trackId: parseInt(trackId),
            });

            if (!deletedTrack || deletedTrack.length === 0) {
                return next(ErrorMiddleware.badRequest('Track not found or you are not authorized to delete it.'));
            }

            return res.json({ message: 'Track deleted successfully.', track: deletedTrack });
        } catch (error) {
            if (error instanceof ErrorMiddleware) {
                return next(error);
            }
            return next(ErrorMiddleware.internal(error.message));
        }
    }
}

module.exports = new trackController();