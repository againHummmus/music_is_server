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
      .select('*, Follower(*), Followee(*)');

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
}

module.exports = (req) => new UserSubscriptionService(req);
