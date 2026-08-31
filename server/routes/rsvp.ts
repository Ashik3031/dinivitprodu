import express from 'express';
import { dbService } from '../db';

const router = express.Router();

// Get RSVPs for an invitation
router.get('/:invitationId', (req, res) => {
  try {
    const { invitationId } = req.params;
    const rsvps = dbService.getRSVPsByInvitation(invitationId);
    return res.json({ rsvps });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Submit RSVP
router.post('/', (req, res) => {
  try {
    const { invitationId, guestName, guestEmail, guestPhone, attendance, guestCount, dietaryPreferences, message } = req.body;
    if (!invitationId || !guestName || !attendance) {
      return res.status(400).json({ error: 'Missing required RSVP fields (invitationId, guestName, attendance)' });
    }

    const rsvp = dbService.submitRSVP({
      invitationId,
      guestName: guestName.trim(),
      guestEmail: guestEmail?.trim(),
      guestPhone: guestPhone?.trim(),
      attendance,
      guestCount: Number(guestCount) || (attendance === 'attending' ? 1 : 0),
      dietaryPreferences: dietaryPreferences?.trim(),
      message: message?.trim()
    });

    return res.status(201).json({
      success: true,
      rsvp,
      message: 'Thank you! Your RSVP response has been received.'
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete RSVP
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    dbService.deleteRSVP(id);
    return res.json({ success: true, message: 'RSVP removed' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
