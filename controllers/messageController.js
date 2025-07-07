const Controller = require('./controller');
const messageService = require('../services/messageService');
const dialogueService = require('../services/dialogueService');
const ErrorMiddleware = require('../error/ErrorMiddleware');

class MessageController extends Controller {
  async create(req, res, next) {
    try {
      const { userId, dialogueId, content, track } = req.body;
      if (!dialogueId || (!content && !track)) {
        return res.status(400).json({ error: 'dialogueId and content are required' });
      }

      const { data: participant, error: partErr } = await messageService(req)
        .supabase
        .from('User_dialogue')
        .select('*')
        .eq('dialogueId', dialogueId)
        .eq('userId', userId)
        .maybeSingle();

      if (partErr) {
        throw new Error('Error checking participant: ' + partErr.message);
      }
      if (!participant) {
        return res.status(403).json({ error: 'Not a participant of this dialogue' });
      }

      const newMessage = await messageService(req).createMessage({
        dialogueId,
        userId: userId,
        content,
        track
      });

      return res.status(201).json(newMessage);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async get(req, res, next) {
    try {
      const userId = req.query.userId;
      const dialogueId = parseInt(req.query.dialogueId, 10);
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
      const id = req.query.id ? parseInt(req.query.id, 10) : 0;
      if (isNaN(dialogueId)) {
        return res.status(400).json({ error: 'Invalid dialogueId' });
      }
      const { data: participant, error: partErr } = await messageService(req)
        .supabase
        .from('User_dialogue')
        .select('*')
        .eq('dialogueId', dialogueId)
        .eq('userId', userId)
        .maybeSingle();

      if (partErr) {
        throw new Error('Error checking participant: ' + partErr.message);
      }
      if (!participant) {
        return res.status(403).json({ error: 'Not a participant of this dialogue' });
      }

      const messages = await messageService(req).getMessages({ dialogueId, limit, offset, id });
      return res.json(messages);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const messageId = parseInt(req.params.id, 10);
      if (isNaN(messageId)) {
        return res.status(400).json({ error: 'Invalid message id' });
      }

      const currentSbUserId = req.user.id;
      const { data: currentUserRecord, error: findUserErr } = await messageService(req)
        .supabase
        .from('User')
        .select('id')
        .eq('sbUserId', currentSbUserId)
        .maybeSingle();

      if (findUserErr || !currentUserRecord) {
        throw new Error('Cannot find current User record');
      }
      const currentUserId = currentUserRecord.id;

      const deleted = await messageService(req).deleteMessage({
        messageId,
        userId: currentUserId,
      });

      if (!deleted || deleted.length === 0) {
        return res.status(404).json({ error: 'Message not found or not owned by user' });
      }
      return res.json({ success: true });
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new MessageController();
