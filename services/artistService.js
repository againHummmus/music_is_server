const uuid = require("uuid");
const {supabase} = require('../utils/supabase')
class ArtistService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async createArtist({ name, image, userId }) {
    try {const fileName = uuid.v4() + ".jpg";

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
          app_role: 'artist',
          artistId: artist.id
        })
        .eq("id", userId);
    }
    if (error) {
      throw new Error(error.message);
    }

    return artist;
  } catch(e) {
    console.log(e)
  }
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

module.exports = (req) => new ArtistService(req);
