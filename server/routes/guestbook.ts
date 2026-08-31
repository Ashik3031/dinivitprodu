import express from 'express';
import { dbService } from '../db';

const router = express.Router();

// Get guestbook messages
router.get('/:invitationId', (req, res) => {
  try {
    const { invitationId } = req.params;
    const messages = dbService.getGuestbookByInvitation(invitationId);
    return res.json({ messages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Post a guestbook message
router.post('/', (req, res) => {
  try {
    const { invitationId, senderName, relationship, message } = req.body;
    if (!invitationId || !senderName || !message) {
      return res.status(400).json({ error: 'Sender name and message are required' });
    }

    const newMsg = dbService.addGuestbookMessage({
      invitationId,
      senderName: senderName.trim(),
      relationship: relationship?.trim() || 'Guest',
      message: message.trim(),
      isApproved: true
    });

    return res.status(201).json({
      success: true,
      message: newMsg,
      statusMessage: 'Your message has been posted to the guestbook!'
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete message
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    dbService.deleteGuestbookMessage(id);
    return res.json({ success: true, message: 'Guestbook message removed' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
