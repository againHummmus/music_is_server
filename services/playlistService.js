const userPlaylistService = require("../services/userPlaylistService");
const {supabase} = require('../utils/supabase')
class PlaylistService {
  constructor(req) {
    this.req = req;
    this.supabase = supabase(req);
  }
  async createPlaylist({ name, creatorId, description, isPublic, isDefault }) {
    const { data, error } = await this.supabase
      .from("Playlist")
      .insert({ name, Creator: creatorId, description, is_public: isPublic, is_default: isDefault })
      .select("*, Creator(*), Playlist_track(*)");

    await userPlaylistService(this.req).createUserPlaylist({ userId: creatorId, playlistId: data[0].id, is_creator: true })

    if (error) {
      throw new Error("Error creating playlist: " + error.message);
    }
    return data[0];
  }

  async deletePlaylist({ id }) {
    const { data, error } = await this.supabase
      .from("Playlist")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting playlist with id ${id}: ${error.message}`);
    }
    return data;
  }


  async searchPlaylists({
    id,
    name,
    creatorId,
    isPublic,
    isDefault,
    limit = 10,
    offset = 0,
  }) {

    let query = this.supabase.from("Playlist").select('*, "Creator"(*), "User_playlist"(*), "Playlist_track" (*, Track(*, Album(*), Artist(*, User(*)), Track_like(*), Playlist_track(*)))');
    if (id) {
      query = query.eq("id", id);
    }
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }
    if (creatorId) {
      query = query.eq("Creator", creatorId);
    }
    if (isPublic !== undefined) {
      query = query.eq("is_public", isPublic);
    }
    if (isDefault !== undefined) {
      query = query.eq("is_default", isDefault);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Error searching playlists: " + error.message);
    }
    return data;
  }
}

module.exports = (req) => new PlaylistService(req);
