const ErrorMiddleware = require("../error/ErrorMiddleware");
const playlistTrackService = require("../services/playlistTrackService")
const Controller = require("./controller");

class playlistTrackController extends Controller {
    async create(req, res, next) {
        try {
            const {trackID, playlistID} = req.body
            const playlistTrack = await playlistTrackService.createPlaylistTrack({trackID, playlistID})
            return res.json(playlistTrack)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const playlistTrack = await playlistTrackService.deletePlaylistTrack({id})
            return res.json(playlistTrack)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getTracksByPlaylist(req, res, next) {
        try {
            const {playlistID} = req.params
            const playlistTracks = await playlistTrackService.getTracksByPlaylist({playlistID})
            return res.json(playlistTracks)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
}

module.exports = new playlistTrackController()
