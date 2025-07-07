const { supabase } = require('../utils/supabase');

class UserSubscriptionService {
  constructor(req) {
    this.supabase = supabase(req);
  }

  async createSubscription({ follower, followee }) {
    const { data, error } = await this.supabase
      .from('User_user_subscription')
      .insert([{ Follower: follower, Followee: followee }])
      .select();
    if (error) {
      throw new Error('Error creating subscription: ' + error.message);
    }
    return data;
  }

  async deleteSubscription({ id }) {
    const { data, error } = await this.supabase
      .from('User_user_subscription')
      .delete()
      .match({ id });
    if (error) {
      throw new Error(`Error deleting subscription ${id}: ${error.message}`);
    }
    return data;
  }

  async searchSubscriptions({ follower, followee, limit = 10, offset = 0 }) {
    let query = this.supabase
      .from('User_user_subscription')
      .select('*, Follower(*), Followee(*, Post(*, Post_like(*)))');

    if (follower) {
      query = query.eq('Follower', follower);
    }
    if (followee) {
      query = query.eq('Followee', followee);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw new Error('Error searching subscriptions: ' + error.message);
    }
    return data;
  }

  async searchMutualFriends({ userId, limit = 10, offset = 0, getPlaylists, getPosts }) {
    if (!userId) {
      throw new Error('userId is required to search mutual friends.');
    }

    try {
      const { data: followingRelations, error: followingError } = await this.supabase
        .from('User_user_subscription')
        .select('Followee')
        .eq('Follower', userId);

      if (followingError) {
        throw new Error('Error fetching following relations: ' + followingError.message);
      }
      const followingIds = new Set(followingRelations.map(sub => sub.Followee));

      const { data: followerRelations, error: followerError } = await this.supabase
        .from('User_user_subscription')
        .select('Follower')
        .eq('Followee', userId);

      if (followerError) {
        throw new Error('Error fetching follower relations: ' + followerError.message);
      }
      const followerIds = new Set(followerRelations.map(sub => sub.Follower));

      const mutualFriendIds = [...followingIds].filter(id => followerIds.has(id));

      if (mutualFriendIds.length === 0) {
        return [];
      }


      let playlistNestedSelect = ', User_playlist(*, Playlist(*, Creator(*), Playlist_track(*, Track(*, Album(*), Artist(*), Track_like(*), Playlist_track(*))) ) )';      

      const selectString = `*${getPosts ? ', Post(*, Post_like(*)) ' : ''}${getPlaylists ? playlistNestedSelect : ''}`;


      const { data: mutualFriends, error: usersError } = await this.supabase
        .from('User')
        .select(selectString)
        .in('id', mutualFriendIds)
        .range(offset, offset + limit - 1);

      if (usersError) {
        throw new Error('Error fetching mutual friends details: ' + usersError.message);
      }
      return mutualFriends;

    } catch (error) {
      console.error('An error occurred in searchMutualFriends:', error.message);
      throw error;
    }
  }
}


module.exports = (req) => new UserSubscriptionService(req);
