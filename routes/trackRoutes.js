const Router = require('express');
const router = new Router();
const trackController = require('../controllers/trackController');
const AuthMiddleware = require('../middlewares/authMiddleware');

router.post('/', AuthMiddleware, trackController.create);
router.get('/', trackController.getAll);
router.get('/:id', trackController.getOne);
router.get('/genre/:genreId', trackController.getTracksByGenreId);
router.get('/artist/:artistId', trackController.getTracksByArtistId);
router.get('/album/:albumId', trackController.getTracksByAlbumId);
router.get('/user/:userId', trackController.getTracksByUserId);
router.get('/name/:name', trackController.getTracksByName);

module.exports = router;