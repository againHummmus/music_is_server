const Controller = require('./controller');
const dialogueService = require('../services/dialogueService');
const ErrorMiddleware = require('../error/ErrorMiddleware');

class DialogueController extends Controller {
  async create(req, res, next) {
    try {
      const { userId, otherUserId } = req.body;
      if (!otherUserId || !userId) {
        return res.status(400).json({ error: 'Both userId and otherUserId is required' });
      }

      if (userId === otherUserId) {
        return res.status(400).json({ error: 'Cannot create dialogue with yourself' });
      }

      const existingDialogueId = await dialogueService(req)
        .findExistingDialogue(userId, otherUserId);

      if (existingDialogueId) {
        return res.status(200).json({ dialogueId: existingDialogueId, isNew: false });
      }

      const newDialogue = await dialogueService(req).createDialogue();
      const newDialogueId = newDialogue.id;

      await dialogueService(req).addParticipants(newDialogueId, userId, otherUserId);

      return res.status(201).json({ dialogueId: newDialogueId, isNew: true });
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async userDialogues(req, res, next) {
    try {
      const { userId } = req.params

      const dialogues = await dialogueService(req).getUserDialogues(userId);
      return res.json(dialogues);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async participants(req, res, next) {
    try {
      const dialogueId = parseInt(req.query.dialogueId, 10);
      if (isNaN(dialogueId)) {
        return res.status(400).json({ error: 'Invalid dialogueId' });
      }

      const participants = await dialogueService(req).getParticipants(dialogueId);
      return res.json(participants);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new DialogueController();
