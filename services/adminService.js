const {supabaseAdmin} = require('../utils/supabase')


class AdminService {

    async adminCreatePlaylist({ name, creatorId, description, isPublic, isDefault }) {
        const { data, error } = await supabaseAdmin
            .from("Playlist")
            .insert({ name, Creator: creatorId, description, is_public: isPublic, is_default: isDefault })
            .select("*, Creator(*), Playlist_track(*)");

        await this.adminCreateUserPlaylist({ userId: creatorId, playlistId: data[0].id, is_creator: true })

        if (error) {
            throw new Error("Error creating playlist: " + error.message);
        }
        return data[0];
    }

    async adminCreateUserPlaylist({ userId, playlistId, is_creator }) {
        const { data, error } = await supabaseAdmin
            .from("User_playlist")
            .insert([{ User: userId, Playlist: playlistId, is_creator }])
            .select();

        if (error) {
            throw new Error(`Error creating user_playlist: ${error.message}`);
        }
        return data;
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
