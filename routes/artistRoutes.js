const Router = require('express')
const router = new Router()
const artistController = require('../controllers/artistController')

router.post('/', artistController.create)
router.get('/', artistController.searchArtists)

module.exports = router
