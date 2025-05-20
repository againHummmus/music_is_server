const Router = require('express');
const router = new Router();
const userSubscriptionController = require('../controllers/userSubscriptionController')

router.post('/',    userSubscriptionController.create);
router.get('/',     userSubscriptionController.search);
router.delete('/:id', userSubscriptionController.delete);

module.exports = router;
