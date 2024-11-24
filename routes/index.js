const Router = require('express')
const router = new Router()

const albumRoutes = require('./albumRoutes')
const artistRoutes = require('./artistRoutes')
const genreRoutes = require('./genreRoutes')
const playlistRoutes = require('./playlistRoutes')
const playlistTrackRoutes = require('./playlistTrackRoutes')
const trackRoutes = require('./trackRoutes')
const userRoutes = require('./userRoutes')

router.use('/album', albumRoutes)
router.use('/artist', artistRoutes)
router.use('/genre', genreRoutes)
router.use('/playlist', playlistRoutes)
router.use('/playlistTrack', playlistTrackRoutes)
router.use('/track', trackRoutes)
router.use('/user', userRoutes)

module.exports = router