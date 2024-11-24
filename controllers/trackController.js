const {Track} = require ("../models")
const uuid = require ("uuid")
const path = require("path");
const trackService = require("../services/trackService")
const ApiError = require("../error/ApiError");

class trackController {
    async create(req, res, next) {
        try {
            const {genreID, artistID, albumID, name, duration} = req.body
            const {fileName} = req.files
            const {playsNumber} = 0;
            const track = await trackService.createTrack({genreID, artistID, albumID, name, duration, fileName, playsNumber})
            return res.json(track)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }
    async getAll(req, res, next) {
        try {
            const tracks = await trackService.getAllTracks()
            console.log(tracks)
            return res.json(tracks)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const track = await trackService.getOneTrack({id})
            return res.json(track)
        }
        catch (error) {
            return next(ApiError.internal("Internal error"))
        }
    }

}

module.exports = new trackController()
