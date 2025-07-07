const uuid = require("uuid");
const { supabase } = require('../utils/supabase')

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

    if (isAddedByUser === 'true') {
      const { data: artist, error: artistError } = await this.supabase
        .from("Artist")
        .select("*, User(*)")
        .eq("id", artistId)
        .maybeSingle();
      if (artistError) {
        throw new Error("Error fetching artist: " + artistError.message);
      }
      if (artist?.User.length > 0) {

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

  async searchTracks({
    id,
    genre,
    artist,
    album,
    likedByUserId,
    name,
    limit,
    offset,
    sortByLikes = false,
  }) {
    let query;

    if (sortByLikes) {
      query = this.supabase
        .from('track_with_like_count_last_day')
        .select('*, Artist(*), Album(*), Genre(*)')
        .order('likes_count_last_day', { ascending: false });
    } else {
      query = this.supabase
        .from('Track')
        .select('*, Artist(*), Album(*), Genre(*), Track_like(*)');
    }

    if (id) query = query.eq('id', id);
    if (genre) query = query.eq('genreId', genre);
    if (artist) query = query.eq('artistId', artist);
    if (album) query = query.eq('albumId', album);
    if (name) query = query.ilike('name', `%${name}%`);
    if (likedByUserId) {
      query = query
        .select('*, Artist(*), Album(*), Genre(*), Track_like!inner(*)')
        .eq('Track_like.userId', likedByUserId);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error('Error searching tracks: ' + error.message);
    }
    return data;
  }

  async deleteTrack({ trackId }) {
    if (!trackId) {
      throw new Error('trackId is required to delete a track.');
    }

    const { data: trackToDelete, error: fetchError } = await this.supabase
      .from('Track')
      .select('id, file_hash, artistId')
      .eq('id', trackId)
      .maybeSingle();

    if (fetchError) {
      throw new Error('Error fetching track for deletion: ' + fetchError.message);
    }

    if (!trackToDelete) {
      return [];
    }
    if (trackToDelete.file_hash) {
      const { error: storageError } = await this.supabase.storage
        .from('musicIsStorage')
        .remove([`mp3/${trackToDelete.file_hash}`]);

      if (storageError) {
        console.warn('Warning: Could not delete file from storage:', storageError.message);
      }
    }

    const { data, error: deleteError } = await this.supabase
      .from('Track')
      .delete()
      .eq('id', trackId)
      .select(); 

    if (deleteError) {
      throw new Error('Error deleting track record: ' + deleteError.message);
    }
    if (data.length === 0) {
      return [];
    }

    return data[0]; 
  }
}

module.exports = (req) => new TrackService(req);