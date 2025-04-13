const playlistService = require ("../services/playlistService")
const Controller = require("./controller");
const ErrorMiddleware = require("../error/ErrorMiddleware");

class playlistController extends Controller {
    async create(req, res, next) {
        try {
            const {name, creatorId, isPublic} = req.body
            const playlist = await playlistService.createPlaylist({name, creatorId, isPublic})
            return res.json(playlist)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    async getAll(req, res, next) {
        try {
            const playlists = await playlistService.getAllPlaylists()
            return res.json(playlists)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getAllByUser(req, res, next) {
        try {
            const {userID} = req.params
            const playlists = await playlistService.getPlaylistsByUser({userID})
            return res.json(playlists)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async searchPlaylists(req, res, next) {
        try {
            const { name, creatorId, isPublic, limit, offset } = req.query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            const playlists = await genreService.searchGenres({
                name: name || '',
                limit: parsedLimit,
                offset: parsedOffset,
                creatorId, 
                is_public: isPublic,
            });
            return res.json(playlists)
        } catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const playlist = await playlistService.deletePlaylist({id})
            return res.json(playlist)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
}

module.exports = new playlistController()
