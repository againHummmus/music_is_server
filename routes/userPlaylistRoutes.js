const router = require("express").Router();
const userPlaylistController = require("../controllers/userPlaylistController");

router.post("/", userPlaylistController.create);
router.delete("/:id", userPlaylistController.delete);
router.get("/", userPlaylistController.search);

module.exports = router;
