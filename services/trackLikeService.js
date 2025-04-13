const { createClient } = require("@supabase/supabase-js");

class TrackLikeService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }


  async createTrackLike({ userId, trackId }) {
    const { data: trackLike, error } = await this.supabase
      .from("Track_like")
      .upsert([
        {
          userId: userId,
          trackId: trackId,
        },
      ])
      .select()
      .single();
    
    if (error) {
      throw new Error("Error creating track like: " + error.message);
    }
    return trackLike;
  }


  async searchTrackLikes({ userId, trackId, limit = 10, offset = 0 }) {
    let query = this.supabase.from("Track_like").select("*");

    if (userId) {
      query = query.eq("userId", userId);
    }
    if (trackId) {
      query = query.eq("trackId", trackId);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Error searching track likes: " + error.message);
    }
    return data;
  }

  async deleteTrackLike({ userId, trackId }) {
    const { data, error } = await this.supabase
      .from("Track_like")
      .delete()
      .eq("userId", userId)
      .eq("trackId", trackId)
      .select()
      .single();
    if (error) {
      throw new Error("Error deleting track like: " + error.message);
    }
    return data;
  }
}

module.exports = new TrackLikeService();
