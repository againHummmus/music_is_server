const {supabase} = require('../utils/supabase')

class TrackLikeService {
  constructor(req) {
    this.supabase = supabase(req);
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

    const { data: playlist, error: playlistError } = await this.supabase
      .from("Playlist")
      .select("*")
      .eq("is_default", true)
      .eq("Creator", userId)
      .eq("name", "Favourite")


    await this.supabase
      .from("Playlist_track")
      .upsert([
        {
          trackId: trackId,
          playlistId: playlist[0].id,
        },
      ])

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

      const { data: playlist, error: playlistError } = await this.supabase
      .from("Playlist")
      .select("*")
      .eq("is_default", true)
      .eq("Creator", userId)
      .eq("name", "Favourite")


      const {error: deleteError} = await this.supabase
      .from('Playlist_track')
      .delete()
      .eq('trackId', trackId)
      .eq('playlistId', playlist[0].id);

    if (error) {
      throw new Error("Error deleting track like: " + error.message);
    }
    if (playlistError) {
      throw new Error("Error deleting track like: " + playlistError.message);
    }

    if (deleteError) {
      throw new Error("Error deleting track like: " + deleteError.message);
    }
    return data;
  }
}

module.exports = (req) => new TrackLikeService(req);
