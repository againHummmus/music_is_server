const { createClient } = require("@supabase/supabase-js");

// Инициализация Supabase клиента
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class genreService {
  async createGenre({ name }) {
    const { data: genre, error } = await supabase
      .from("Genre")
      .insert([{ name }])
      .select()
      .single();

      if (error) throw error;

    return genre;
  }

  async getAllGenres() {
    const { data: genres, error } = await supabase.from("Genre").select("*");

    if (error) throw error;

    return genres;
  }

  async getOneGenre({ id }) {
    const { data: genre, error } = await supabase
      .from("Genre")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return genre;
  }

  async getOneGenreByName({ name }) {
    const { data: genre, error } = await supabase
      .from("Genre")
      .select("*")
      .eq("name", name)
      .single();

    if (error) throw error;
    return genre;
  }
}

module.exports = new genreService();
