// const playlistService = require ("../services/playlistService")
// const ApiError = require("../error/ApiError");

// class playlistController {
//     async create(req, res, next) {
//         try {
//             const {name, userID} = req.body
//             const playlist = await playlistService.createPlaylist({name, userID})
//             return res.json(playlist)
//         }
//         catch (error) {
//             return next(ApiError.internal("Internal error"))
//         }
//     }
//     async getAll(req, res, next) {
//         try {
//             const playlists = await playlistService.getAllPlaylists()
//             return res.json(playlists)
//         }
//         catch (error) {
//             return next(ApiError.internal("Internal error"))
//         }
//     }

//     async getAllByUser(req, res, next) {
//         try {
//             const {userID} = req.params
//             const playlists = await playlistService.getPlaylistsByUser({userID})
//             return res.json(playlists)
//         }
//         catch (error) {
//             return next(ApiError.internal("Internal error"))
//         }
//     }

//     async delete(req, res, next) {
//         try {
//             const {id} = req.params
//             const playlist = await playlistService.deletePlaylist({id})
//             return res.json(playlist)
//         }
//         catch (error) {
//             return next(ApiError.internal("Internal error"))
//         }
//     }
// }

// module.exports = new playlistController()
