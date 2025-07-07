const express = require('express');
const router = express.Router();
const dialogueController = require('../controllers/dialogueController');

router.post('/', dialogueController.create);
router.get('/:userId(\\d+)', dialogueController.userDialogues);
router.get('/participants', dialogueController.participants);

module.exports = router;
