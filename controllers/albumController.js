const ErrorMiddleware = require("../error/ErrorMiddleware");
const albumService = require ("../services/albumService")
const Controller = require("./controller");

class albumController extends Controller {
    async create(req, res, next) {
        try {
            const { name, year, artistId } = req.body
            const { image } = req.files
            const data = await albumService.createAlbum({name, year, artistId, image})
            return res.json(data)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await albumService.getAlbums()
            return res.json(data)
        }
        catch (error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const album = await albumService.getAlbum({id})
            return res.json(album)
        }
        catch(error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getAlbumByName(req, res, next) {
        try {
            const {name} = req.params
            const album = await albumService.getAlbumByName({name})
            return res.json(album)
        }
        catch(error) {
            console.error(error);
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getAlbumsByArtistId(req, res, next) {
        try {
            const { artistId } = req.params;
            const albums = await albumService.getAlbumsByArtistId({ artistId });
            return res.json(albums);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

}

module.exports = new albumController()
