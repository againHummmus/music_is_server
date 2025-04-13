const uuid = require("uuid");
const { createClient } = require("@supabase/supabase-js");

class TrackService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async createTrack({ genreId, artistId, albumId, name, file, lyrics }) {
    const fileStorageName = uuid.v4() + ".mp3";

    const { error: uploadError } = await this.supabase.storage
      .from("musicIsStorage/mp3")
      .upload(fileStorageName, file.data, {
        contentType: "audio/mpeg",
      });
    if (uploadError) {
      throw new Error("Error uploading file: " + uploadError.message);
    }

    const { data, error } = await this.supabase
      .from("Track")
      .insert([
        { genreId, artistId, albumId, name, file_hash: fileStorageName, lyrics }
      ])
      .select();
    if (error) {
      throw new Error("Error creating track: " + error.message);
    }

    return data[0];
  }

  async searchTracks({ id, genre, artist, album, likedByUserId, name, limit = 10, offset = 0 }) {
    let query = this.supabase.from("Track").select("*, Artist(*), Album(*), Genre(*), Track_like(*)");
  
    if (id) {
      query = query.eq("id", id);
    }
    if (genre) {
      query = query.eq("genreId", genre);
    }
    if (artist) {
      query = query.eq("artistId", artist);
    }
    if (album) {
      query = query.eq("albumId", album);
    }
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }
    if (likedByUserId) {
      query = query.select("*, Artist(*), Album(*), Genre(*), Track_like!inner(*)");
      query = query.eq("Track_like.userId", likedByUserId);
    }
  
    const { data: tracks, error: tracksError } = await query.range(offset, offset + limit - 1);
    if (tracksError) {
      throw new Error("Error searching tracks: " + tracksError.message);
    }
    return tracks;
  }
}

module.exports = new TrackService();
