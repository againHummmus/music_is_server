const { supabase } = require('../utils/supabase');

class PostService {
    constructor(req) {
        this.supabase = supabase(req);
    }

    async createPost({ content, trackId, playlistId, userId }) {
        const { data, error } = await this.supabase
            .from('Post')
            .insert([{ content, trackId, playlistId, userId }])
            .select('*');
        if (error) throw new Error('Error creating post: ' + error.message);
        return data[0];
    }

    async deletePost({ id }) {
        const { data, error } = await this.supabase
            .from('Post')
            .delete()
            .eq('id', id);
        if (error) throw new Error(`Error deleting post ${id}: ` + error.message);
        return data;
    }

    async searchPosts({ id, trackId, playlistId, userId, limit = 10, offset = 0 }) {
        let query = this.supabase.from('Post').select('*, Post_like(*)');
        if (id) query = query.eq('id', id);
        if (trackId) query = query.eq('trackId', trackId);
        if (playlistId) query = query.eq('playlistId', playlistId);
        if (userId) query = query.eq('userId', userId);
        const { data, error } = await query.range(offset, offset + limit - 1);
        if (error) throw new Error('Error fetching posts: ' + error.message);
        return data;
    }
}

module.exports = (req) => new PostService(req);
