const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenService = require("./tokenService");
const { supabase } = require('../utils/supabase')
const { supabaseAdmin } = require('../utils/supabase')
const uuid = require("uuid");

class AuthService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async signUp({ email, password, username, avatar }) {
    let authUser, userProfile, user, playlists;
    const fileName = uuid.v4() + '.jpg';

    try {
      const { data: au, error: ae } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });
      if (ae) throw new Error('Error creating auth user: ' + ae.message);
      authUser = au;

      const hashed = await bcrypt.hash(password, 10);
      const { data: u, error: ue } = await supabaseAdmin
        .from('User')
        .insert({
          id: authUser.id,
          email,
          username,
          password_hash: hashed,
          profile_id: userProfile.id,
          avatar_url: avatar ? fileName : null
        })
        .select('*, Artist(*)')
        .single();
      if (ue) throw new Error('Error creating user record: ' + ue.message);
      user = u;

      if (avatar) {
        const { error: ie } = await supabaseAdmin
          .storage
          .from('musicIsStorage/img')
          .upload(fileName, avatar.data, { contentType: avatar.mimetype });
        if (ie) throw new Error('Error uploading avatar: ' + ie.message);
      }

      const playlistInserts = [
        { name: 'Favourite', Creator: user.id, description: 'Your favorite tracks', is_public: false, is_default: true },
        { name: 'Added by me', Creator: user.id, description: "Tracks where you're the author", is_public: false, is_default: true },
        { name: 'Recommendations', Creator: user.id, description: 'Tracks you may like', is_public: false, is_default: true },
        { name: 'Your friends like this', Creator: user.id, description: 'Tracks your friends listen to', is_public: false, is_default: true },
      ];
      const { data: pls, error: ple } = await supabaseAdmin
        .from('Playlist')
        .insert(playlistInserts)
        .select();
      if (ple) throw new Error('Error creating playlists: ' + ple.message);
      playlists = pls;

      const recs = playlists.find(pl => pl.name === 'Recommendations');
      await this.fillRecommendations({ playlistId: recs.id });

      const { data: sd, error: se } = await this.supabase.auth.signInWithPassword({ email, password });
      if (se) throw new Error('Error signing in after signup: ' + se.message);

      return { user, userProfile, session: sd.session };

    } catch (err) {
      if (playlists) {
        const ids = playlists.map(pl => pl.id);
        await supabaseAdmin.from('Playlist').delete().in('id', ids).catch(() => { });
      }
      if (user) {
        await supabaseAdmin.from('User').delete().eq('id', user.id).catch(() => { });
      }
      if (authUser) {
        await supabaseAdmin.auth.admin.deleteUser(authUser.id).catch(() => { });
        if (avatar) {
          await supabaseAdmin.storage.from('musicIsStorage/img').remove([fileName]).catch(() => { });
        }
      }
      throw err;
    }
  }

  async signIn({ email, password }) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })
    const { data: user } = await supabaseAdmin
      .from('User')
      .select('*, Artist(*)')
      .eq('sbUserId', data.user.id)
      .single();

    if (!!error) {
      throw new Error('Sign-in failed: ' + error);
    }
    return { user, session: data.session };
  }

  async getMe(access_token) {
    const { data, error: userErr } = await supabaseAdmin.auth.getUser(access_token);
    if (userErr) {
      throw new Error('Failed to fetch auth user: ' + userErr.message);
    }
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('User')
      .select('*, Artist(*)')
      .eq('sbUserId', data.user.id)
      .single();
    if (profileErr) {
      throw new Error('Failed to fetch user profile: ' + profileErr.message);
    }
    return profile;
  }

  async refresh(refresh_token) {
    const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token });
    const { data: user, error: userError } = await supabaseAdmin
      .from("User")
      .select('*, Artist(*)')
      .eq("sbUserId", data.user.id)
      .single();
    if (error) {
      throw new Error("Error fetching user: " + error.message);
    }
    if (userError) {
      throw new Error('Failed to refresh session: ' + userError.message);
    }
    return { session: data.session, user };
  }


  async updatePassword({ email, resetCode, newPassword }) {
    const { data: user, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .eq("reset_code", resetCode)
      .single();
    if (error || !user) {
      throw new Error("Invalid reset code or user not found");
    }

    if (new Date() > new Date(user.reset_code_expires)) {
      throw new Error("Reset code has expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await this.supabase
      .from("User")
      .update({
        password_hash: hashedPassword,
        reset_code: null,
        reset_code_expires: null,
      })
      .eq("id", user.id);
    if (updateError) {
      throw new Error("Error updating password: " + updateError.message);
    }

    return { message: "Password has been updated successfully" };
  }

  async activate(activationLink) {
    const { data: user, error } = await supabaseAdmin
      .from("User")
      .select("*")
      .eq("activation_link", activationLink)
      .single();
    if (error || !user) {
      throw new Error("Incorrect activation link");
    }

    const { error: updateError } = await supabaseAdmin
      .from("User")
      .update({ is_activated: true })
      .eq("id", user.id);
    if (updateError) {
      throw new Error("Error activating account: " + updateError.message);
    }

    return { message: "Account activated successfully" };
  }

  async signOut(refresh_token) {
    const token = await tokenService.removeToken(refresh_token);
    return token;
  }

  async getUser(id) {
    const user = await this.supabase
      .from('User')
      .select('*, Artist(*)')
      .eq('id', id)
      .single();
    return user;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    await supabaseAdmin.auth.admin.disableUser((await this.supabase.auth.getUser()).data.user.id);
    return { message: 'Signed out' };
  }

}

module.exports = (req) => new AuthService(req);
