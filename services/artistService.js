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

    const { data: artist, error } = await this.supabase
      .from("Artist")
      .insert([
        {
          name,
          image_hash: fileName,
        },
      ])
      .select()
      .single();
    
    if (!!userId) {
      await this.supabase
        .from("User")
        .update({
          role: 'artist',
          artistId: artist.id
        })
        .eq("id", userId);
    }
    if (error) {
      throw new Error(error.message);
    }

    return artist;
  }

  async searchArtists({ name, limit = 10, offset = 0 }) {
    let query = this.supabase.from("Artist").select("*");
  
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }
  
    const { data, error } = await query.range(offset, offset + limit - 1);
  
    if (error) {
      throw new Error("Error searching artists: " + error.message);
    }
    return data;
  }
}

module.exports = new ArtistService();
