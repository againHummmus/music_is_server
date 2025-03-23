const uuid = require("uuid");
const { createClient } = require("@supabase/supabase-js");

class ArtistService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  async createArtist({ name, image, userId }) {
    const fileName = uuid.v4() + ".jpg";

    const { error: imageError } = await this.supabase.storage
      .from("musicIsStorage/img")
      .upload(fileName, image.data, {
        contentType: "image/jpeg",
      });

    if (imageError) {
      throw new Error("Error loading image: " + imageError.message);
    }

    const { data, error } = await this.supabase
      .from("Artist")
      .insert([
        {
          name,
          userId,
          image_hash: fileName,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getAllArtists() {
    const { data, error } = await this.supabase.from("Artist").select("*");

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getOneArtist({ id }) {
    const { data, error } = await this.supabase
      .from("Artist")
      .select("*")
      .eq("id", id)
      .single();

      if (error) {
        throw new Error(error.message);
      }
  
      return data;
  }

  async getOneArtistByName({ name }) {
    const { data, error } = await this.supabase
      .from("Artist")
      .select("*")
      .eq("name", name)
      .single();

      if (error) {
        throw new Error(error.message);
      }
  
      return data;
  }
}

module.exports = new ArtistService();
