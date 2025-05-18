const { supabaseAdmin } = require('../utils/supabase')


class AdminService {

  async createDefaultPlaylistsForUser(userId) {
    const playlistDefs = [
      { name: 'Favourite', Creator: userId, description: 'Your favorite tracks', is_public: false, is_default: true },
      { name: 'Added by me', Creator: userId, description: "Tracks where you're the author", is_public: false, is_default: true },
      { name: 'Recommendations', Creator: userId, description: 'Tracks you may like', is_public: false, is_default: true },
      { name: 'Your friends like this', Creator: userId, description: 'Tracks your friends listen to', is_public: false, is_default: true },
    ];

    const { data: playlists, error } = await supabaseAdmin
      .from('Playlist')
      .insert(playlistDefs)
      .select('id,name');
    if (error) throw new Error('Error creating default playlists: ' + error.message);

    const userPlaylistInserts = playlists.map(pl => ({
      User: userId,
      Playlist: pl.id,
      is_creator: true,
    }));
    const { error: upError } = await supabaseAdmin
      .from('User_playlist')
      .insert(userPlaylistInserts);
    if (upError) {
      await supabaseAdmin.from('Playlist').delete().in('id', playlists.map(p => p.id));
      throw new Error('Error creating User_playlist links: ' + upError.message);
    }

    const rec = playlists.find(pl => pl.name === 'Recommendations');
    if (rec) {
      await this.fillRecommendations({ playlistId: rec.id });
    }

    return playlists;
  }

  async adminDeletePlaylist({ playlistId }) {
    const { error: ptError } = await supabaseAdmin
      .from('Playlist_track')
      .delete()
      .eq('playlistId', playlistId);
    if (ptError) {
      throw new Error(`Error deleting playlist tracks: ${ptError.message}`);
    }

    const { error: upError } = await supabaseAdmin
      .from('User_playlist')
      .delete()
      .eq('Playlist', playlistId);
    if (upError) {
      throw new Error(`Error deleting user_playlist links: ${upError.message}`);
    }

    const { data, error: pError } = await supabaseAdmin
      .from('Playlist')
      .delete()
      .eq('id', playlistId)
      .select()
      .single();
    if (pError) {
      throw new Error(`Error deleting playlist: ${pError.message}`);
    }

    return data;
  }

  async fillRecommendations({ playlistId }) {
    const { data: tracks } = await supabaseAdmin
      .from('Track')
      .select('*, Artist(*), Album(*), Genre(*), Track_like(*)')
      .limit(15);

    const rows = tracks.map((track) => ({
      trackId: track.id,
      playlistId,
    }));

    const { data, error } = await supabaseAdmin
      .from('Playlist_track')
      .insert(rows)
      .select();

    if (error) {
      throw new Error("Error creating recommendation: " + error.message);
    }
    return data;
  }

  async updateUserActivationLink(email, activationLink) {
    await supabaseAdmin
      .from("User")
      .update({
        activation_link: activationLink
      })
      .eq("email", email);
  }

}

module.exports = new AdminService();
