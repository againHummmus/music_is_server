const Router = require("express");
const router = new Router();
const postLikeController = require("../controllers/postLikeController");
const AdminMiddleware = require("../middlewares/adminMiddleware");

router.post("/", AdminMiddleware, postLikeController.create);
router.get("/", postLikeController.search);

module.exports = router;
