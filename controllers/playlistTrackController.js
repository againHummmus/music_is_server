const playlistTrackService = require("../services/playlistTrackService")
const ApiError = require("../error/ApiError");

class playlistTrackController {
    async create(req, res, next) {
        try {
            const {trackID, playlistID} = req.body
            const playlistTrack = await playlistTrackService.createPlaylistTrack({trackID, playlistID})
            return res.json(playlistTrack)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }
    async getAll(req, res, next) {
        try {
            const playlistTracks = await playlistTrackService.getAllPlaylistTrack()
            return res.json(playlistTracks)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const playlistTrack = await playlistTrackService.deletePlaylistTrack({id})
            return res.json(playlistTrack)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }

    async getTracksByPlaylist(req, res, next) {
        try {
            const {playlistID} = req.params
            const playlistTracks = await playlistTrackService.getTracksByPlaylist({playlistID})
            return res.json(playlistTracks)
        }
        catch (error) {
            console.log(error)
            return next(ApiError.internal("Internal error"))
        }
    }
}

module.exports = new playlistTrackController()
