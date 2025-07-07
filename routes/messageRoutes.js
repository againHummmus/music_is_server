const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.create);
router.get('/', messageController.get);
router.delete('/:id', messageController.delete);

module.exports = router;
