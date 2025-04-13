const Router = require("express");
const router = new Router();
const trackLikeController = require("../controllers/trackLikeController");

router.post("/", trackLikeController.create);
router.get("/", trackLikeController.search);
router.delete("/:userId/:trackId", trackLikeController.delete);

module.exports = router;
