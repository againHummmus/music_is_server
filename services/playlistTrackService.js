const { createClient } = require("@supabase/supabase-js");

class PlaylistTrackService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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

  async getAllPlaylistTrack() {
    const { data, error } = await this.supabase
      .from("Playlist_track")
      .select("*");

    if (error) {
      throw new Error(`Error fetching all playlist tracks: ${error.message}`);
    }
    return data;
  }

  async deletePlaylistTrack({ id }) {
    const { data, error } = await this.supabase
      .from("Playlist_track")
      .delete()
      .match({ id });

    if (error) {
      throw new Error(`Error deleting playlist track with id ${id}: ${error.message}`);
    }
    return data;
  }

  async getTracksByPlaylist({ playlistID }) {
    const { data, error } = await this.supabase
      .from("Playlist_track")
      .select("*")
      .eq("playlistId", playlistID);

    if (error) {
      throw new Error(`Error fetching tracks by playlist ${playlistID}: ${error.message}`);
    }
    return data;
  }
}

module.exports = new PlaylistTrackService();
