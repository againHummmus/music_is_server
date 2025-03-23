const { createClient } = require("@supabase/supabase-js");
const uuid = require("uuid");

class AlbumService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async createAlbum({ name, year, artistId, image }) {
    const fileName = uuid.v4() + ".jpg";

    const { error: imageError } = await this.supabase.storage
      .from("musicIsStorage/img")
      .upload(fileName, image.data, {
        contentType: "image/jpeg",
      });

    if (imageError) {
      throw new Error("Error fetching albums: " + imageError.message);
    }

    const { data, error } = await this.supabase
      .from("Album")
      .insert([
        {
          name,
          year,
          artistId,
          image_hash: fileName,
        },
      ])
      .select()
      .single();
    if (error) {
      throw new Error("Error fetching albums: " + error.message);
    }
    return data;
  }

  async getAlbums() {
    const { data, error } = await this.supabase
      .from("Album")
      .select("*");

    if (error) {
      throw new Error("Error fetching albums: " + error.message);
    }

    return data;
  }

  async getAlbum({ id }) {
    const { data, error } = await this.supabase
      .from("Album")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Error fetching album with id " + id + ": " + error.message);
    }

    return data;
  }

  async getAlbumByName({ name }) {
    const { data, error } = await this.supabase
      .from("Album")
      .select("*")
      .eq("name", name)
      .single();

    if (error) {
      throw new Error("Error fetching album by name " + name + ": " + error.message);
    }

    return data;
  }

  async getAlbumsByArtistId({ artistId }) {
    const { data, error } = await this.supabase
      .from("Album")
      .select("*")
      .eq("artistId", artistId);

    if (error) {
      throw new Error("Error fetching albums for artistId " + artistId + ": " + error.message);
    }

    return data;
  }
}

module.exports = new AlbumService();
