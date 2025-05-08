const Controller = require("./controller");
const ErrorMiddleware = require("../error/ErrorMiddleware");
const userPlaylistService = require("../services/userPlaylistService");

class userPlaylistController extends Controller {
  async create(req, res, next) {
    try {
      const { userId, playlistId, is_creator } = req.body;
      const result = await userPlaylistService(req).createUserPlaylist({
        userId,
        playlistId,
        is_creator,
      });
      return res.json(result);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userPlaylistService(req).deleteUserPlaylist({ id });
      return res.json(result);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

  async search(req, res, next) {
    try {
      const {
        userId,
        playlistId,
        isCreator: isCreatorRaw,
        limit: limitRaw,
        offset: offsetRaw,
        includeDefaultPlaylists: isincludeDefaultPlaylistsRaw
      } = req.query;

      const isCreator =
        isCreatorRaw === undefined
          ? undefined
          : isCreatorRaw === "true" || isCreatorRaw === true;

          const includeDefaultPlaylists =
          isincludeDefaultPlaylistsRaw === undefined
            ? undefined
            : isincludeDefaultPlaylistsRaw === "true" || isincludeDefaultPlaylistsRaw === true;

      const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
      const offset = offsetRaw ? parseInt(offsetRaw, 10) : undefined;

      const results = await userPlaylistService(req).searchUserPlaylists({
        userId,
        playlistId,
        isCreator,
        limit,
        offset,
        includeDefaultPlaylists
      });
      return res.json(results);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

}

module.exports = new userPlaylistController();
