const { createClient } = require("@supabase/supabase-js");

class PostLikeService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async createPostLike({ userId, postId }) {
    const { data: postLike, error } = await this.supabase
      .from("PostLike")
      .insert([
        {
          userId,
          postId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error("Error creating post like: " + error.message);
    }
    return postLike;
  }


  async searchPostLikes({ userId, postId, limit = 10, offset = 0 }) {
    let query = this.supabase.from("PostLike").select("*");

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
}

module.exports = new PostLikeService();
