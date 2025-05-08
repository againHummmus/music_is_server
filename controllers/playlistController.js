const playlistService = require("../services/playlistService");
const Controller = require("./controller");
const ErrorMiddleware = require("../error/ErrorMiddleware");
const jwt = require("jsonwebtoken");
const { parse } = require('cookie');

class playlistController extends Controller {
  async create(req, res, next) {
    try {
      const { name, creatorId, description, isPublic } = req.body;
      const playlist = await playlistService(req).createPlaylist({
        name,
        description,
        creatorId,
        isPublic,
      });
      return res.json(playlist);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const playlist = await playlistService(req).deletePlaylist({ id });
      return res.json(playlist);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async search(req, res, next) {
    try {
      const {
        id,
        name,
        creatorId,
        isPublic,
        isDefault,
        limit: limitRaw,
        offset: offsetRaw,
      } = req.query;

      const playlists = await playlistService(req).searchPlaylists({
        id,
        name,
        creatorId,
        isPublic:
          isPublic === undefined
            ? undefined
            : isPublic === "true" || isPublic === true,
        isDefault:
          isDefault === undefined
              ? undefined
              : isDefault === "true" || isDefault === true,
        limit: limitRaw ? parseInt(limitRaw, 10) : undefined,
        offset: offsetRaw ? parseInt(offsetRaw, 10) : undefined,
      });

      return res.json(playlists);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new playlistController();
