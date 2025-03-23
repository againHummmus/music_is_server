const uuid = require("uuid");
const { createClient } = require("@supabase/supabase-js");

class TrackService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async createTrack({ genreId, artistId, albumId, userId, name, duration, file, lyrics }) {
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
        { genreId, artistId, albumId, userId, name, duration, fileName: fileStorageName, lyrics }
      ])
      .select();
    if (error) {
      throw new Error("Error creating track: " + error.message);
    }

    return data[0];
  }

  async getAllTracks() {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*");
    if (error) {
      throw new Error("Error fetching tracks: " + error.message);
    }
    return data;
  }

  async getOneTrack({ id }) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error("Error fetching track: " + error.message);
    }
    return data;
  }

  async getTrackById(id) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error("Error fetching track by id: " + error.message);
    }
    return data;
  }

  async getTracksByGenreId(genreId) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .eq("genreId", genreId);
    if (error) {
      throw new Error("Error fetching tracks by genre: " + error.message);
    }
    return data;
  }

  async getTracksByArtistId(artistId) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .eq("artistId", artistId);
    if (error) {
      throw new Error("Error fetching tracks by artist: " + error.message);
    }
    return data;
  }

  async getTracksByAlbumId(albumId) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .eq("albumId", albumId);
    if (error) {
      throw new Error("Error fetching tracks by album: " + error.message);
    }
    return data;
  }

  async getTracksByUserId(userId) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .eq("userId", userId);
    if (error) {
      throw new Error("Error fetching tracks by user: " + error.message);
    }
    return data;
  }

  async getTracksByName(name) {
    const { data, error } = await this.supabase
      .from("Track")
      .select("*")
      .ilike("name", `%${name}%`);
    if (error) {
      throw new Error("Error fetching tracks by name: " + error.message);
    }
    return data;
  }
}

module.exports = new TrackService();
