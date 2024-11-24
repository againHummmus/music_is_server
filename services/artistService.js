const { createClient } = require('@supabase/supabase-js')
const uuid = require('uuid')

// Инициализация Supabase клиента
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

class ArtistService {
    async createArtist({ name, image }) {
        // Генерируем уникальное имя файла
        const fileName = uuid.v4() + '.jpg'
        
        // Загружаем изображение в Supabase Storage
        const { data: imageData, error: imageError } = await supabase
            .storage
            .from('musicIsStorage/img') 
            .upload(fileName, image.data, {
                contentType: 'image/jpeg'
            })

        if (imageError) throw imageError

        const { data: artist, error } = await supabase
            .from('Artist')
            .insert([
                { 
                    name, 
                    image_hash: fileName 
                }
            ])
            .select()
            .single()

        if (error) throw error
        return artist
    }

    async getAllArtists() {
        const { data: artists, error } = await supabase
            .from('Artist')
            .select('*')

        if (error) throw error
        return artists
    }

    async getOneArtist({id}) {
        const { data: artist, error } = await supabase
            .from('Artist')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return artist
    }

    async getOneArtistByName({name}) {
        const { data: artist, error } = await supabase
            .from('Artist')
            .select('*')
            .eq('name', name)
            .single()

        if (error) throw error
        return artist
    }
}

module.exports = new ArtistService()