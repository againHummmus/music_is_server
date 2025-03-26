const Router = require('express');
const router = new Router();
const mailController = require('../controllers/mailController');

router.post('/activation', mailController.sendActivationLink);
router.post('/reset-email', mailController.sendResetEmail);
router.post('/reset-password', mailController.resetPassword);

module.exports = router;
