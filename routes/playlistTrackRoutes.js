const Router = require('express')
const router = new Router()
const playlistTrackController = require('../controllers/playlistTrackController')

router.post('/', playlistTrackController.create)
router.delete('/:id', playlistTrackController.delete)
router.get('/:playlistID', playlistTrackController.search)

module.exports = router
