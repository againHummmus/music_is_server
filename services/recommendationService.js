const { supabase, supabaseAdmin } = require('../utils/supabase')

class RecommendationService {
  constructor(req) {
    this.supabase = supabase(req);
  }

async regenerateForUser(userId) {
    const { data: recs, error: rpcErr } = await supabaseAdmin
      .rpc('get_recommended_users', { current_user_id: userId });
    if (rpcErr) throw new Error('RPC failed: ' + rpcErr.message);
    const { error: delErr } = await supabaseAdmin
      .from('User_recommendation')
      .delete()
      .eq('User', userId);
    if (delErr) throw new Error('Failed to delete old recs: ' + delErr.message);
    console.log(recs)
    const rows = recs.map(r => ({
      User: userId,
      RecommendedUser: r.rec_user_id,
    }));
    if (rows.length > 0) {
      const { error: insErr } = await supabaseAdmin
        .from('User_recommendation')
        .insert(rows);
      if (insErr) throw new Error('Failed to insert new recs: ' + insErr.message);
    }

    return recs;
  }

  async regenerateForAllUsers() {
    const { data: users, error: usersErr } = await supabaseAdmin
      .from('User')
      .select('id');
    if (usersErr) throw new Error('Failed to fetch users: ' + usersErr.message);

    // paraller quiries (TODO: try p-map)
    // await Promise.all(
    //   users.map(u => this.regenerateForUser(u.id))
    // );

    for (const u of users) {
      await this.regenerateForUser(u.id);
    }
  }

//   async getRecommendedTracks(userId, limit = 20) {
//     const { data, error } = await this.supabase
//       .rpc('get_recommended_tracks', { current_user_id: userId })
//       .limit(limit);
//     if (error) throw new Error('getRecommendedTracks: ' + error.message);
//     return data;
//   }
}

module.exports = (req) => new RecommendationService(req);
