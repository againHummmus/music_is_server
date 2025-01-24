const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

class PlaylistService {
    async createPlaylist({name, userID}) {
        const { data, error } = await supabase
            .from('Playlist')
            .insert([
                { name, user_id: userID }
            ])
            .select()

        if (error) throw error
        return data[0]
    }

    async getAllPlaylists() {
        const { data, error } = await supabase
            .from('Playlist')
            .select('*')

        if (error) throw error
        return data
    }

    async getPlaylistsByUser({userID}) {
        const { data, error } = await supabase
            .from('Playlist')
            .select('*')
            .eq('user_id', userID)

        if (error) throw error
        return data
    }

    async deletePlaylist({id}) {
        const { error } = await supabase
            .from('Playlist')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = new PlaylistService()