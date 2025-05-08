const ErrorMiddleware = require("../error/ErrorMiddleware");
const playlistLikeService = require("../services/playlistLikeService");
const Controller = require("./controller");

class PlaylistLikeController extends Controller {
    async create(req, res, next) {
        try {
            const { userId, playlistId } = req.body;
            const playlistLike = await playlistLikeService(req).createPlaylistLike({ userId, playlistId });
            return res.json(playlistLike);
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message));
        }
    }


    async search(req, res, next) {
        try {
            const { userId, playlistId, limit, offset } = req.query;
            const playlistLikes = await playlistLikeService(req).searchPlaylistLikes({
                userId,
                playlistId,
                limit: limit ? parseInt(limit, 10) : 10,
                offset: offset ? parseInt(offset, 10) : 0,
            });
            return res.json(playlistLikes);
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message));
        }
    }
}

module.exports = new PlaylistLikeController();
