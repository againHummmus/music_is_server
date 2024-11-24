// const {Playlist} = require ("../models")

// class playlistService {
//     async createPlaylist({name, userID}) {
//         const playlist = await Playlist.create({name, userID})
//         return playlist
//     }
//     async getAllPlaylists() {
//         const playlists = await Playlist.findAll()
//         return playlists
//     }

//     async getPlaylistsByUser({userID}) {
//         const playlists = await Playlist.findAll({where: {userID}})
//         return playlists
//     }

//     async deletePlaylist({id}) {
//         const playlist = await Playlist.destroy({where: {id}})
//         return playlist
//     }
// }

// module.exports = new playlistService()
