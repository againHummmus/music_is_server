const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/user-dto");
const { createClient } = require("@supabase/supabase-js");

class AuthService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async signUp({ res, email, password, username, avatar }) {
    const { data: existingUserSameEmail } = await this.supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .single();
    if (existingUserSameEmail) {
      throw new Error("User with this email already exists");
    }

    const { data: existingUserSameUserName } = await this.supabase
      .from("User")
      .select("*")
      .eq("username", username)
      .single();
    if (existingUserSameUserName) {
      throw new Error("User with this username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fileName = uuid.v4() + ".jpg";

    const { data: user, error: userError } = await this.supabase
      .from("User")
      .insert([
        {
          email,
          username,
          password_hash: hashedPassword,
        },
      ])
      .select()
      .single();
    if (userError) {
      throw new Error("Error creating user: " + userError.message);
    }

    const { error: uploadError } = await this.supabase.storage
      .from("musicIsStorage/img")
      .upload(fileName, avatar.data, {
        contentType: "image/jpeg",
      });
    if (uploadError) {
      await this.supabase.from("User").delete().eq("id", user.id);
      throw new Error("Error uploading avatar: " + uploadError.message);
    }

    const { data: userProfile, error: userProfileError } = await this.supabase
      .from("User_profile")
      .insert([
        {
          userId: user.id,
          avatar_url: fileName,
        },
      ])
      .select()
      .single();
    if (userProfileError) {
      await this.supabase.from("User").delete().eq("id", user.id);
      throw new Error("Error creating user profile: " + userProfileError.message);
    }

    try {
      const userDto = new UserDto(user);
      const { refreshToken, accessToken } = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, refreshToken);
      res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true })
      return { user, userProfile, accessToken };
    } catch (e) {
      await this.supabase.from("User_profile").delete().eq("userId", user.id);
      await this.supabase.from("User").delete().eq("id", user.id);
      await this.supabase.storage.from("musicIsStorage/img").remove([fileName]);
      console.log('error happened here', e)
      throw new Error(e)
    }
  }

  async signIn({ res, email, password }) {
    const { data: user, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    try {
      const userDto = new UserDto(user);
      const { refreshToken, accessToken } = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, refreshToken);
      res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true })
      return { user, accessToken };
    } catch (e) {
      console.log('error happened here', e)
      throw new Error(e)
    }
  }

  async checkUser(token) {
    if (!token) {
      throw new Error("No token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      throw new Error("Invalid token");
    }

    const { data, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("id", decoded.user_id)
      .single();
    if (error) {
      throw new Error("Error fetching user: " + error.message);
    }

    return data;
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
    const { data: user, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("activation_link", activationLink)
      .single();
    if (error || !user) {
      throw new Error("Incorrect activation link");
    }

    const { error: updateError } = await this.supabase
      .from("User")
      .update({ is_activated: true })
      .eq("id", user.id);
    if (updateError) {
      throw new Error("Error activating account: " + updateError.message);
    }

    return { message: "Account activated successfully" };
  }

  async signOut(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async getUser(id) {
    const user = await this.supabase
    .from('User')
    .select('*')
    .eq('id', id)
    .single();
    return user;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new Error('Error in token validation');
    }

    const { data: user, error } = await this.supabase
      .from('User')
      .select('*')
      .eq('id', userData.id)
      .single();

    if (error || !user) {
      throw new Error(error?.message || 'User not found');
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

}

module.exports = new AuthService();
