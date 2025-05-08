const Controller = require("./controller");
const ErrorMiddleware = require("../error/ErrorMiddleware");
const playlistTrackService = require("../services/playlistTrackService");

class playlistTrackController extends Controller {

   async create(req, res, next) {
    try {
      const { trackId, playlistId } = req.body;
      const playlistTrack = await playlistTrackService(req).createPlaylistTrack({
        trackId,
        playlistId,
      });
      return res.json(playlistTrack);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const playlistTrack = await playlistTrackService(req).deletePlaylistTrack({
        id,
      });
      return res.json(playlistTrack);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async search(req, res, next) {
    try {
      const {
        playlistId,
        trackId,
        limit: limitRaw,
        offset: offsetRaw,
      } = req.query;

      const results = await playlistTrackService(req).searchPlaylistTracks({
        playlistId,
        trackId,
        limit: limitRaw ? parseInt(limitRaw, 10) : undefined,
        offset: offsetRaw ? parseInt(offsetRaw, 10) : undefined,
      });

      return res.json(results);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new playlistTrackController();
