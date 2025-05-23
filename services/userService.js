const bcrypt = require("bcrypt");
const { supabase } = require('../utils/supabase')
const { supabaseAdmin } = require('../utils/supabase')
const uuid = require("uuid");
const adminService = require("./adminService");

class AuthService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async signUp({ email, password, username }) {
    let authUser, user;
    try {
      const { data: au, error: ae } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });
      if (ae) throw new Error("Error creating auth user: " + ae.message);
      authUser = au;

      const hashed = await bcrypt.hash(password, 10);

      const { data: u, error: ue } = await supabaseAdmin
        .from("User")
        .insert({
          sbUserId: authUser.user.id,
          email,
          username,
          password_hash: hashed,
        })
        .select()
        .single();
      if (ue) throw new Error("Error creating user record: " + ue.message);
      user = u;

      await adminService.createDefaultPlaylistsForUser(user.id);

      const { data: sd, error: se } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (se) throw new Error("Error signing in after signup: " + se.message);

      return { user, session: sd.session };

    } catch (err) {
      if (user) {
        await supabaseAdmin.from("User").delete().eq("id", user.id);
      }
      if (authUser) {
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
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
    console.log(data)
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


  async getUser(id) {
    const user = await this.supabase
      .from('User')
      .select('*, Artist(*), User_playlist(*, Playlist(*, Creator(*), Playlist_track(*, Track(*, Album(*)))))')
      .eq('id', id)
      .single();
    return user;
  }

  async searchUsers({
    username,
    app_role,
    artist_id,
    limit = 10,
    offset = 0,
  }) {
    let query = this.supabase
      .from('User')
      .select(`
        *,
        Artist(*),
        User_playlist(
          *,
          Playlist(
            *,
            Creator(*),
            Playlist_track(
              *,
              Track(
                *,
                Album(*)
              )
            )
          )
        )
      `);
    if (username) {
      query = query.ilike('username', `${username}%`);
    }
    if (app_role) {
      query = query.eq('app_role', app_role);
    }
    if (artist_id) {
      query = query.eq('artistId', artist_id);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error('Error searching users: ' + error.message);
    }
    return data;
  }

  async updateUser({ id, newUsername, avatar }) {
    if (newUsername) {
      const { data: existing, error: dupErr } = await this.supabase
        .from('User')
        .select('id')
        .eq('username', newUsername)
        .maybeSingle();
      if (dupErr) throw new Error('Error checking username uniqueness: ' + dupErr.message);
      if (existing && existing.id !== id) {
        throw new Error('Username already taken');
      }
    }

    const avatarFileName = uuid.v4() + '.jpg';

    if (avatar) {
      console.log(avatarFileName)
      const { error: uploadErr } = await supabaseAdmin
        .storage
        .from('musicIsStorage/img')
        .upload(avatarFileName, avatar.data, { contentType: avatar.mimetype, upsert: true });
      if (uploadErr) {
        throw new Error('Error uploading avatar: ' + uploadErr.message);
      }
    }

    const updates = {};
    if (newUsername) updates.username = newUsername;
    if (avatarFileName) updates.avatar_url = avatarFileName;

    const { data: updatedUser, error: updErr } = await this.supabase
      .from('User')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (updErr) {
      throw new Error('Error updating user: ' + updErr.message);
    }
    return updatedUser;
  }
}

module.exports = (req) => new AuthService(req);
