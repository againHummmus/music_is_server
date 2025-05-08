const ErrorMiddleware = require("../error/ErrorMiddleware");
const trackLikeService = require("../services/trackLikeService");
const Controller = require("./controller");

class TrackLikeController extends Controller {
  async create(req, res, next) {
    try {
      const { userId, trackId } = req.body;
      const trackLike = await trackLikeService(req).createTrackLike({ userId, trackId });
      return res.json(trackLike);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async search(req, res, next) {
    try {
      const { userId, trackId, limit, offset } = req.query;
      const trackLikes = await trackLikeService(req).searchTrackLikes({
        userId,
        trackId,
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      return res.json(trackLikes);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { userId, trackId } = req.params;
      const deletedTrackLike = await trackLikeService(req).deleteTrackLike({ userId, trackId });
      return res.json(deletedTrackLike);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new TrackLikeController();
