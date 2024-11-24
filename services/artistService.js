const { Artist, Album} = require("../models");
const uuid = require('uuid');
const path = require("path");

class ArtistService {
    async createArtist({ name, image }) {
        const fileName = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, '../static/', 'artistPhotos', fileName));
        const artist = await Artist.create({ name, image: fileName });
        return artist;
    }

    async getAllArtists() {
        const artists = await Artist.findAll();
        return artists;
    }

    async getOneArtist({id}) {
        const artist = await Artist.findOne({where: {id}})
        return artist
    }

    async getOneArtistByName({name}) {
        const artist = await Artist.findOne({where: {name}})
        return artist
    }
}

module.exports = new ArtistService();
