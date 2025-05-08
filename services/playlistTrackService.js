const {supabase} = require('../utils/supabase')


class PlaylistTrackService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async createPlaylistTrack({ trackId, playlistId }) {
    const { data, error } = await this.supabase
      .from("Playlist_track")
      .insert([{ trackId, playlistId }])
      .select();

    if (error) {
      throw new Error(`Error creating playlist track: ${error.message}`);
    }
    return data;
  }

  async deletePlaylistTrack({ id }) {
    const { data, error } = await this.supabase
      .from("Playlist_track")
      .delete()
      .match({ id });

    if (error) {
      throw new Error(
        `Error deleting playlist track with id ${id}: ${error.message}`
      );
    }
    return data;
  }

  async searchPlaylistTracks({
    playlistId,
    trackId,
    limit = 10,
    offset = 0,
  }) {
    let query = this.supabase.from("Playlist_track").select("*");

    if (playlistId) {
      query = query.eq("playlistId", playlistId);
    }
    if (trackId) {
      query = query.eq("trackId", trackId);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw new Error(
        `Error searching playlist tracks: ${error.message}`
      );
    }
    return data;
  }
}

module.exports = (req) => new PlaylistTrackService(req);
