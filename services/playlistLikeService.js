const { createClient } = require("@supabase/supabase-js");

class PlaylistLikeService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async createPlaylistLike({ userId, playlistId }) {
    const { data: playlistLike, error } = await this.supabase
      .from("PlaylistLike")
      .insert([
        {
          userId,
          playlistId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error("Error creating playlist like: " + error.message);
    }
    return playlistLike;
  }


  async searchPlaylistLikes({ userId, playlistId, limit = 10, offset = 0 }) {
    let query = this.supabase.from("PlaylistLike").select("*");

    if (userId) {
      query = query.eq("userId", userId);
    }
    if (playlistId) {
      query = query.eq("playlistId", playlistId);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error("Error searching playlist likes: " + error.message);
    }
    return data;
  }
}

module.exports = new PlaylistLikeService();
