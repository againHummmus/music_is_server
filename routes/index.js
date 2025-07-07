const Router = require('express')
const router = new Router()

const albumRoutes = require('./albumRoutes')
const artistRoutes = require('./artistRoutes')
const genreRoutes = require('./genreRoutes')
const playlistRoutes = require('./playlistRoutes')
const playlistTrackRoutes = require('./playlistTrackRoutes')
const trackRoutes = require('./trackRoutes')
const userRoutes = require('./userRoutes')
const mailRoutes = require('./mailRoutes')
const postLikeRoutes = require('./postLikeRoutes')
const playlistLikeRoutes = require('./playlistLikeRoutes')
const trackLikeRoutes = require('./trackLikeRoutes')
const userPlaylistRoutes = require('./userPlaylistRoutes')
const userSubscriptionRoutes = require('./userSubscriptionRoutes');
const postRoutes = require('./postRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const messageRoutes = require('./messageRoutes');
const dialogueRoutes = require('./dialogueRoutes');

const AuthMiddleware = require('../middlewares/authMiddleware')


router.use('/user-subscription', AuthMiddleware, userSubscriptionRoutes);
router.use('/album', AuthMiddleware, albumRoutes)
router.use('/artist', AuthMiddleware, artistRoutes)
router.use('/genre', AuthMiddleware, genreRoutes)
router.use('/playlist', AuthMiddleware, playlistRoutes)
router.use('/playlist-track', AuthMiddleware, playlistTrackRoutes)
router.use('/track', AuthMiddleware, trackRoutes)
router.use('/user', userRoutes)
router.use('/mail', AuthMiddleware, mailRoutes)
router.use('/post-like', AuthMiddleware, postLikeRoutes)
router.use('/playlist-like', AuthMiddleware, playlistLikeRoutes)  
router.use('/track-like', AuthMiddleware, trackLikeRoutes)
router.use('/user-playlist', AuthMiddleware, userPlaylistRoutes)
router.use('/post', postRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/messages', AuthMiddleware, messageRoutes);
router.use('/dialogues', AuthMiddleware, dialogueRoutes);

module.exports = router