const uuid = require("uuid");
const Service = require("./service");
const {supabase} = require('../utils/supabase')

class AlbumService {
  constructor(req) {
    this.supabase = supabase(req);
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

  async searchAlbums({ name, artistId, limit = 10, offset = 0 }) {
    let albumQuery = this.supabase.from("Album").select("*");

    if (name) {
      albumQuery = albumQuery.ilike("name", `%${name}%`);
    } 
    
    if (artistId) {
      albumQuery = albumQuery.eq("artistId", artistId);
    }

    const { data, error } = await albumQuery.range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Error searching albums: " + error.message);
    }

    return data;
  }
}

module.exports = (req) => new AlbumService(req);
