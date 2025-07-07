const { supabase } = require('../utils/supabase');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); 
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex'); 

class MessageService {
  constructor(req) {
    this.supabase = supabase(req);
  }

  encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async createMessage({ dialogueId, userId, content, track }) {
    const encryptedContent = this.encrypt(content);
    const { data, error } = await this.supabase
      .from('Message')
      .insert([{ dialogueId, userId, content: encryptedContent || undefined, Track: track }])
      .select()
      .single();

    if (error) {
      throw new Error('Error creating message: ' + error.message);
    }
    return data;
  }

  async getMessages({ dialogueId, id, limit = 50, offset = 0 }) {
    let query = this.supabase
      .from('Message')
      .select(`
        id,
        content,
        Track (*, Artist(*), Album(*), Genre(*), Track_like(*)),
        created_at,
        userId,
        "User" (
          id,
          username,
          avatar_url
        )
      `)
      .eq('dialogueId', dialogueId);

    if (id) {
      query = query.eq('id', id);
    }

    const { data, error } = await query
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error('Error fetching messages: ' + error.message);
    }

    if (data) {
      return data.map(message => ({
        ...message,
        content: this.decrypt(message.content)
      }));
    }
    return data;
  }

  async deleteMessage({ messageId, userId }) {
    const { data, error } = await this.supabase
      .from('Message')
      .delete()
      .eq('id', messageId)
      .eq('userId', userId)
      .select();
    if (error) {
      throw new Error('Error deleting message: ' + error.message);
    }
    return data;
  }
}

module.exports = (req) => new MessageService(req);