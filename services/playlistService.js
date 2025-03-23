const { createClient } = require("@supabase/supabase-js");

class PlaylistService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }  

  async createPlaylist({ name, creatorId, isPublic }) {
    const { data, error } = await this.supabase
      .from("Playlist")
      .insert([{ name, creatorId, is_public: isPublic }])
      .select();

    if (error) {
      throw new Error("Error creating playlist: " + error.message);
    }

    return data[0];
  }

  async getAllPlaylists() {
    const { data, error } = await this.supabase
      .from("Playlist")
      .select("*");

    if (error) {
      throw new Error("Error fetching all playlists: " + error.message);
    }

    return data;
  }

  async getPlaylistsByUser({ userID }) {
    const { data, error } = await this.supabase
      .from("Playlist")
      .select("*")
      .eq("creatorId", userID);

    if (error) {
      throw new Error(`Error fetching playlists for user ${userID}: ${error.message}`);
    }

    return data;
  }

  async deletePlaylist({ id }) {
    const { data, error } = await this.supabase
      .from("Playlist")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting playlist with id ${id}: ${error.message}`);
    }

    return data;
  }
}

module.exports = new PlaylistService();
