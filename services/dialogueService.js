const { supabase } = require('../utils/supabase');

class DialogueService {
  constructor(req) {
    this.supabase = supabase(req);
  }

  async findExistingDialogue(userId1, userId2) {
    const { data, error } = await this.supabase
      .from('User_dialogue')
      .select('dialogueId')
      .in('userId', [userId1, userId2]);

    if (error) {
      throw new Error('Error finding existing dialogue: ' + error.message);
    }

    const counter = {};
    for (const row of data) {
      const did = row.dialogueId;
      counter[did] = (counter[did] || 0) + 1;
      if (counter[did] === 2) {
        return did;
      }
    }
    return null;
  }

  async createDialogue() {
    const { data, error } = await this.supabase
      .from('Dialogue')
      .insert([{ title: null }])
      .select('id')
      .single();
    if (error) {
      throw new Error('Error creating dialogue: ' + error.message);
    }
    return data;
  }

  async addParticipants(dialogueId, creatorUserId, otherUserId) {
    const rows = [
      { dialogueId, userId: creatorUserId, is_creator: true },
      { dialogueId, userId: otherUserId, is_creator: false },
    ];
    const { error } = await this.supabase
      .from('User_dialogue')
      .insert(rows);
    if (error) {
      throw new Error('Error adding participants: ' + error.message);
    }
  }

  async getUserDialogues(userId) {
    const { data, error } = await this.supabase
      .from('User_dialogue')
      .select(`
        dialogueId,
        "Dialogue"(
          id,
          title,
          "User_dialogue"(*, User(*)),
          Message (count)
        )
      `)
      .eq('userId', userId);
    if (error) {
      throw new Error('Error fetching user dialogues: ' + error.message);
    }
    return data;
  }

  async getParticipants(dialogueId) {
    const { data, error } = await this.supabase
      .from('User_dialogue')
      .select(`
        userId,
        is_creator,
        "User" (
          id,
          username,
          avatar_url
        )
      `)
      .eq('dialogueId', dialogueId);
    if (error) {
      throw new Error('Error fetching participants: ' + error.message);
    }
    return data;
  }
}

module.exports = (req) => new DialogueService(req);
