const ErrorMiddleware = require("../error/ErrorMiddleware");
const trackService = require("../services/trackService")
const Controller = require("./controller");

class trackController extends Controller {
    async create(req, res, next) {
        try {
            const { genreId, artistId, albumId, userId, name, duration, lyrics } = req.body;
            const { file } = req.files;
    
            const track = await trackService.createTrack({
                genreId,
                artistId,
                albumId,
                userId,
                name,
                duration,
                file,
                lyrics
            });
    
            return res.json(track);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    async getAll(req, res, next) {
        try {
            const tracks = await trackService.getAllTracks()
            return res.json(tracks)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const track = await trackService.getOneTrack({id})
            return res.json(track)
        }
        catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }

    async getTrackById(req, res, next) {
        try {
            const { id } = req.params;
            const track = await trackService.getTrackById(id);
            return res.json(track);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    
    async getTracksByGenreId(req, res, next) {
        try {
            const { genreId } = req.params;
            const tracks = await trackService.getTracksByGenreId(genreId);
            return res.json(tracks);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    
    async getTracksByArtistId(req, res, next) {
        try {
            const { artistId } = req.params;
            const tracks = await trackService.getTracksByArtistId(artistId);
            return res.json(tracks);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    
    async getTracksByAlbumId(req, res, next) {
        try {
            const { albumId } = req.params;
            const tracks = await trackService.getTracksByAlbumId(albumId);
            return res.json(tracks);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    
    async getTracksByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const tracks = await trackService.getTracksByUserId(userId);
            return res.json(tracks);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
    
    async getTracksByName(req, res, next) {
        try {
            const { name } = req.params;
            const tracks = await trackService.getTracksByName(name);
            return res.json(tracks);
        } catch (error) {
            return next(ErrorMiddleware.internal(error.message))
        }
    }
}

module.exports = new trackController()
