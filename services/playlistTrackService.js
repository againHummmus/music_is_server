const {PlaylistTrack} = require ("../models")

class playlistTrackService {
    async createPlaylistTrack({trackID, playlistID}) {
        const playlistTrack = await PlaylistTrack.create({trackID, playlistID})
        return playlistTrack
    }
    async getAllPlaylistTrack() {
        const playlistTracks = await PlaylistTrack.findAll()
        return playlistTracks
    }

    async deletePlaylistTrack({id}) {
        const playlistTrack = await PlaylistTrack.destroy({where: {id}})
        return playlistTrack
    }

    async getTracksByPlaylist({playlistID}) {
        const playlistTracks = await PlaylistTrack.findAll({where: {playlistID}})
        return playlistTracks
    }

}

module.exports = new playlistTrackService()
