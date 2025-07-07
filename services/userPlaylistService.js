const {supabase} = require('../utils/supabase')


class UserPlaylistService {
  constructor(req) {
    this.supabase = supabase(req);
  }
async createUserPlaylist({ userId, playlistId, is_creator }) {
    const { data, error } = await this.supabase
      .from("User_playlist")
      .insert([{ User: userId, Playlist: playlistId, is_creator }])
      .select();

    if (error) {
      throw new Error(`Error creating user_playlist: ${error.message}`);
    }
    return data;
  }

  async deleteUserPlaylist({ id }) {
    const { data, error } = await this.supabase
      .from("User_playlist")
      .delete()
      .match({ id });

    if (error) {
      throw new Error(
        `Error deleting user_playlist with id ${id}: ${error.message}`
      );
    }
    return data;
  }

  async searchUserPlaylists({
    userId,
    playlistId,
    isCreator,
    limit = 10,
    offset = 0,
    includeDefaultPlaylists = true,
  }) {
    let query = this.supabase
      .from('User_playlist')
      .select(`
        *,
        User(*),
        Playlist!inner(
          *,
          Creator(*),
          Playlist_track(*, Track(*, Album(*), Artist(*)))
        )
      `);
  
    if (userId) query = query.eq('User', userId);
    if (playlistId) query = query.eq('Playlist', playlistId);
    if (isCreator !== undefined) query = query.eq('isCreator', isCreator);
    if (includeDefaultPlaylists === false) {
      query = query.not('Playlist.is_default', 'eq', true);
    }
  
    query = query.range(offset, offset + limit - 1);
  
    const { data, error } = await query;
    if (error) {
      throw new Error(`Error searching user_playlists: ${error.message}`);
    }
    return data;
  }
  
}

module.exports = (req) => new UserPlaylistService(req);
