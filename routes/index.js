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

router.use('/album', albumRoutes)
router.use('/artist', artistRoutes)
router.use('/genre', genreRoutes)
router.use('/playlist', playlistRoutes)
router.use('/playlistTrack', playlistTrackRoutes)
router.use('/track', trackRoutes)
router.use('/user', userRoutes)
router.use('/mail', mailRoutes)
router.use('/postLike', postLikeRoutes)
router.use('/playlistLike', playlistLikeRoutes)  
router.use('/trackLike', trackLikeRoutes)


module.exports = router