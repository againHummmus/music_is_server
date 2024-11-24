const {Album} = require ("../models")
const uuid = require('uuid')
const path = require("path");

class albumService {
    async createAlbum({name, year, artistID, image}) {
        let fileName = uuid.v4() + '.jpg'
        image.mv(path.resolve(__dirname, '../static/',  'albumCovers',  fileName))
        const album = await Album.create({name, year, artistID, image: fileName})
        return album
    }
    async getAllAlbums() {
        const albums = await Album.findAll()
        return albums
    }

    async getOneAlbum({id}) {
        const album = await Album.findOne({where: {id}})
        return album
    }

    async getOneAlbumByName({name}) {
        const album = await Album.findOne({where: {name}})
        return album
    }

}

module.exports = new albumService
