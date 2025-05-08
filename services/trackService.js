const uuid = require("uuid");
const {supabase} = require('../utils/supabase')

class TrackService {
  constructor(req) {
    this.supabase = supabase(req);
  }
  async createTrack({ genreId, artistId, albumId, name, file, lyrics, isAddedByUser }) {
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
        { genreId, artistId, albumId, name, file_hash: fileStorageName, lyrics, isAddedByUser }
      ])
      .select();

    if (isAddedByUser) {
      const { data: artist, error: artistError } = await this.supabase
    .from("Artist")
    .select("*, User(*)")
    .eq("id", artistId)
    .maybeSingle();

      if (artistError) {
        throw new Error("Error fetching artist: " + artistError.message);
      }
      if (artist?.User) {

        const { data: playlist, error: playlistError } = await this.supabase
          .from("Playlist")
          .select("id")
          .eq("is_default", true)
          .eq("Creator", artist?.User[0].id)
          .eq("name", "Added by me")
          .maybeSingle();

        if (playlistError || !playlist) {
          throw new Error("Error finding default playlist: " + playlistError?.message);
        }

        const { error: upsertError } = await this.supabase
          .from("Playlist_track")
          .upsert(
            {
              trackId: data[0].id,
              playlistId: playlist.id,
            },
          );

        if (upsertError) {
          throw new Error("Error upserting Playlist_track: " + upsertError.message);
        }
      }

    }
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

module.exports = (req) => new TrackService(req);
