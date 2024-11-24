const albumService = require ("../services/albumService")
const ApiError = require("../error/ApiError");

class albumController {
    async create(req, res, next) {
        try {
            const {name, year, artistID} = req.body
            const {image} = req.files
            const album = await albumService.createAlbum({name, year, artistID, image})
            return res.json(album)
        }
        catch (error) {
            console.error(error);
            return next(ApiError.internal("Internal error"))
        }
    }
    async getAll(req, res, next) {
        try {
            const albums = await albumService.getAllAlbums()
            return res.json(albums)
        }
        catch (error) {
            console.error(error);
            return next(ApiError.internal(("Internal error")))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const album = await albumService.getOneAlbum({id})
            return res.json(album)
        }
        catch(error) {
            console.error(error);
            return next(ApiError.internal(("Internal error")))
        }
    }

    async getOneByName(req, res, next) {
        try {
            const {name} = req.params
            const album = await albumService.getOneAlbumByName({name})
            return res.json(album)
        }
        catch(error) {
            console.error(error);
            return next(ApiError.internal(("Internal error")))
        }
    }

}

module.exports = new albumController()
