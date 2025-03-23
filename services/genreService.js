const { createClient } = require("@supabase/supabase-js");

class GenreService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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

  async getAllGenres() {
    const { data, error } = await this.supabase
      .from("Genre")
      .select("*");

    if (error) {
      throw new Error("Error fetching genres: " + error.message);
    }

    return data;
  }

  async getOneGenre({ id }) {
    const { data, error } = await this.supabase
      .from("Genre")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching genre with id ${id}: ${error.message}`);
    }

    return data;
  }

  async getOneGenreByName({ name }) {
    const { data, error } = await this.supabase
      .from("Genre")
      .select("*")
      .eq("name", name)
      .single();

    if (error) {
      throw new Error(`Error fetching genre by name "${name}": ${error.message}`);
    }

    return data;
  }
}

module.exports = new GenreService();
