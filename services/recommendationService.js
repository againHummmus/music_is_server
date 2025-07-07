const { supabase, supabaseAdmin } = require('../utils/supabase')

class RecommendationService {
  constructor(req) {
    this.supabase = supabase(req);
  }

  async regenerateForUser(userId) {
    await this.regenerateUsersForUser(userId)
    await this.regenerateFriendsLikeThisForUser(userId)
    await this.regenerateRecommendationsPlaylistForUser(userId)
  }

  async regenerateUsersForUser(userId) {
    const { data: userRecs, error: rpcUsersErr } = await supabaseAdmin
      .rpc('get_recommended_users', { current_user_id: userId });
    if (rpcUsersErr) throw new Error('RPC get_recommended_users failed: ' + rpcUsersErr.message);
    const { error: delUsersErr } = await supabaseAdmin
      .from('User_recommendation')
      .delete()
      .eq('User', userId);
    if (delUsersErr) throw new Error('Failed to delete old user recs: ' + delUsersErr.message);

    const userRows = userRecs.map(r => ({
      User: userId,
      RecommendedUser: r.rec_user_id,
    }));
    if (userRows.length) {
      const { error: insUsersErr } = await supabaseAdmin
        .from('User_recommendation')
        .insert(userRows);
      if (insUsersErr) throw new Error('Failed to insert new user recs: ' + insUsersErr.message);
    }
  }

async regenerateFriendsLikeThisForUser(userId) {
    const { data: playlists, error: plErr } = await supabaseAdmin
      .from('Playlist')
      .select('id')
      .eq('Creator', userId)
      .eq('name', 'Your friends like this')
      .eq('is_default', true)
      .limit(1);
    if (plErr) throw new Error('Failed to fetch recommendations playlist: ' + plErr.message);
    if (!playlists || playlists.length === 0) {
      throw new Error(`Your friends like this playlist not found for user ${userId}`);
    }
    const recPlId = playlists[0].id;


    const { data: trackRecs, error: rpcErr } = await supabaseAdmin
      .rpc('get_recommended_tracks', { current_user_id: userId });
    if (rpcErr) throw new Error('RPC get_recommended_tracks failed: ' + rpcErr.message);

    const { error: delErr } = await supabaseAdmin
      .from('Playlist_track')
      .delete()
      .eq('playlistId', recPlId);
    if (delErr) throw new Error('Failed to delete old recommendations: ' + delErr.message);
    const rows = trackRecs.map(r => ({
      playlistId: recPlId,
      trackId:    r.track_id,
    }));
    if (rows.length) {
      const { error: insErr } = await supabaseAdmin
        .from('Playlist_track')
        .insert(rows)
        .eq('playlistId', recPlId);
      if (insErr) throw new Error('Failed to insert new recommendation tracks: ' + insErr.message);
    }

    return trackRecs;
  }

  async getUserRecommendations(userId) {
    const { data, error } = await supabaseAdmin
      .from('User_recommendation')
      .select('*, RecommendedUser(*)')
      .eq('User', userId);
    if (error) throw new Error('Failed to fetch user recs: ' + error.message);
    return data;
  }

  async regenerateRecommendationsPlaylistForUser(userId) {
    const { data: pls, error: plErr } = await supabaseAdmin
      .from('Playlist')
      .select('id')
      .eq('Creator', userId)
      .eq('name', 'Recommendations')
      .eq('is_default', true)
      .limit(1)
    if (plErr) throw new Error('Failed to fetch Recommendations playlist: ' + plErr.message)
    if (!pls || pls.length === 0) {
      throw new Error(`User ${userId} has no default 'Recommendations' playlist`)
    }
    const recPlId = pls[0].id

    const { data: trackRecs, error: rpcErr } = await supabaseAdmin
        .from('track_with_like_count_last_day')
        .select('*, Artist(*), Album(*), Genre(*)')
        .order('likes_count_last_day', { ascending: false });
    if (rpcErr) throw new Error('RPC get_recommended_tracks failed: ' + rpcErr.message);
    await supabaseAdmin
      .from('Playlist_track')
      .delete()
      .eq('playlistId', recPlId)

    const rows = trackRecs.map(r => ({
      playlistId: recPlId,
      trackId:    r.id,
    }))
    if (rows.length) {
      const { error: insErr } = await supabaseAdmin
        .from('Playlist_track')
        .insert(rows)
      if (insErr) throw new Error('Failed to insert new recommendation tracks: ' + insErr.message)
    }
  }


  async regenerateForAllUsers() {
    const { data: users, error: usersErr } = await supabaseAdmin
      .from('User')
      .select('id');
    if (usersErr) throw new Error('Failed to fetch users: ' + usersErr.message);

    for (const { id } of users) {
      await this.regenerateForUser(id);
    }
  }
}

module.exports = (req) => new RecommendationService(req);
