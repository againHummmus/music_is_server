const Router = require("express");
const router = new Router();
const postLikeController = require("../controllers/postLikeController");

router.post("/", postLikeController.create);
router.get("/", postLikeController.search);
router.delete("/:userId/:postId", postLikeController.delete);

module.exports = router;
