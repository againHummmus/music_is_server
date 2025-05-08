const {supabase} = require('../utils/supabase')
class GenreService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async createGenre({ name }) {
    const { data, error } = await this.supabase
      .from("Genre")
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      throw new Error("Error creating genre: " + error.message);
    }

    return data;
  }

  async searchGenres({ name, limit = 10, offset = 0 }) {
    let query = this.supabase.from("Genre").select("*");
  
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }
  
    const { data, error } = await query.range(offset, offset + limit - 1);
  
    if (error) {
      throw new Error(`Error searching genres: ${error.message}`);
    }
    return data;
  }
  
}

module.exports = (req) => new GenreService(req);
