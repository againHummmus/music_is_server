const {Genre, Artist} = require ("../models")

class genreService {
    async createGenre({name}) {
        const genre = await Genre.create({name})
        return genre;
    }
    async getAllGenres() {
        const genres = await Genre.findAll()
        return genres
    }

    async getOneGenre({id}) {
        const genre = await Genre.findOne({where: {id}})
        return genre
    }

    async getOneGenreByName({name}) {
        const genre = await Genre.findOne({where: {name}})
        return genre
    }
}

module.exports = new genreService()
