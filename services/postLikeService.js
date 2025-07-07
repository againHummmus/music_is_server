const { supabase } = require('../utils/supabase')

class PostLikeService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async createPostLike({ userId, postId }) {
    try {
      const { data: postLike } = await this.supabase
        .from("Post_like")
        .upsert([
          {
            userId: userId,
            postId: postId,
          },
        ])
        .select()
        .single();
      return postLike;
    } catch (error) {
      throw new Error("Error creating post like: " + error.message);
    }

  }


  async searchPostLikes({ userId, postId, limit = 10, offset = 0 }) {
    let query = this.supabase.from("Post_like").select("*");

    if (userId) {
      query = query.eq("userId", userId);
    }
    if (postId) {
      query = query.eq("postId", postId);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Error searching post likes: " + error.message);
    }
    return data;
  }

  async deletePostLike({ userId, postId }) {
    const { data, error } = await this.supabase
      .from("Post_like")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId)
      .select()
      .single();

    const { data: playlist, error: playlistError } = await this.supabase
      .from("Playlist")
      .select("*")
      .eq("is_default", true)
      .eq("Creator", userId)
      .eq("name", "Favourite")


    const { error: deleteError } = await this.supabase
      .from('Playlist_post')
      .delete()
      .eq('postId', postId)
      .eq('playlistId', playlist[0].id);

    if (error) {
      throw new Error("Error deleting post like: " + error.message);
    }
    if (playlistError) {
      throw new Error("Error deleting post like: " + playlistError.message);
    }

    if (deleteError) {
      throw new Error("Error deleting post like: " + deleteError.message);
    }
    return data;
  }
}

module.exports = (req) => new PostLikeService(req);
