const { createClient } = require('@supabase/supabase-js')
const uuid = require('uuid')

// Инициализация Supabase клиента
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

class AlbumService {
    async createAlbum({name, year, artistID, image}) {
        const fileName = uuid.v4() + '.jpg'
        
        const { data: imageData, error: imageError } = await supabase
            .storage
            .from('musicIsStorage/img') 
            .upload(fileName, image.data, {
                contentType: 'image/jpeg'
            })

        if (imageError) throw imageError

        // Создаем запись в базе данных
        const { data: album, error } = await supabase
            .from('Album')
            .insert([
                { 
                    name, 
                    year, 
                    artist_id: artistID, 
                    image: fileName 
                }
            ])
            .select()
            .single()

        if (error) throw error
        return album
    }

    async getAllAlbums() {
        const { data: albums, error } = await supabase
            .from('Album')
            .select('*')

        if (error) throw error
        return albums
    }

    async getOneAlbum({id}) {
        const { data: album, error } = await supabase
            .from('Album')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return album
    }

    async getOneAlbumByName({name}) {
        const { data: album, error } = await supabase
            .from('Album')
            .select('*')
            .eq('name', name)
            .single()

        if (error) throw error
        return album
    }
}

module.exports = new AlbumService