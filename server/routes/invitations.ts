import express from 'express';
import { dbService } from '../db';
import { INITIAL_TEMPLATES, createInvitationFromTemplate } from '../../src/data/initialTemplates';

const router = express.Router();

// List invitations (filtered by businessId or all for admin)
router.get('/', (req, res) => {
  try {
    const { businessId, role } = req.query as { businessId?: string; role?: string };
    const invitations = dbService.getInvitations(businessId, role);
    return res.json({ invitations });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Public slug lookup for published invitation (e.g. /i/:slug)
router.get('/slug/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const invitation = dbService.getInvitationBySlug(slug);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found or link has expired' });
    }
    // Also fetch published rsvps count and approved guestbook
    const rsvps = dbService.getRSVPsByInvitation(invitation.id);
    const guestbook = dbService.getGuestbookByInvitation(invitation.id).filter(g => g.isApproved);

    return res.json({
      invitation,
      stats: {
        totalRsvps: rsvps.length,
        attendingCount: rsvps.filter(r => r.attendance === 'attending').reduce((acc, c) => acc + (c.guestCount || 1), 0),
        guestbookCount: guestbook.length
      },
      guestbook
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get invitation by ID (for editor)
router.get('/:id', (req, res) => {
  try {
    const invitation = dbService.getInvitationById(req.params.id);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    return res.json({ invitation });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new invitation (blank, from template, or duplicate existing)
router.post('/', (req, res) => {
  try {
    const { businessId, title, customerName, eventDate, eventType, templateId, duplicateFromId, category } = req.body;
    if (!businessId || !title) {
      return res.status(400).json({ error: 'Business ID and Title are required' });
    }

    const assignedCategory = eventType || category || 'wedding';

    // Duplicate an existing invitation
    if (duplicateFromId) {
      const duplicated = dbService.duplicateInvitation(duplicateFromId, businessId);
      const updated = dbService.updateInvitation(duplicated.id, {
        title,
        customerName: customerName || duplicated.customerName || '',
        eventDate: eventDate || duplicated.eventDate || '',
        category: assignedCategory,
        eventType: assignedCategory
      });
      return res.status(201).json({ success: true, invitation: updated });
    }

    // Start from template
    if (templateId && templateId !== 'blank') {
      const template = INITIAL_TEMPLATES.find(t => t.id === templateId) || INITIAL_TEMPLATES[0];
      const newInv = createInvitationFromTemplate(template, businessId, title);
      const saved = dbService.createInvitation({
        ...newInv,
        customerName: customerName || '',
        eventDate: eventDate || '',
        category: assignedCategory,
        eventType: assignedCategory
      });
      return res.status(201).json({ success: true, invitation: saved });
    }

    // Create custom blank invitation
    const newInv = dbService.createInvitation({
      businessId,
      title,
      customerName: customerName || '',
      eventDate: eventDate || '',
      category: assignedCategory,
      eventType: assignedCategory
    });
    return res.status(201).json({ success: true, invitation: newInv });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Update invitation (pages, elements, style, settings, etc.)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = dbService.updateInvitation(id, updates);
    return res.json({ success: true, invitation: updated, message: 'Invitation saved successfully' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Duplicate invitation
router.post('/:id/duplicate', (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.body;
    if (!businessId) {
      return res.status(400).json({ error: 'businessId required to clone invitation' });
    }
    const duplicated = dbService.duplicateInvitation(id, businessId);
    return res.status(201).json({ success: true, invitation: duplicated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Save design as template
router.post('/:id/save-template', (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Template title required' });
    }
    const template = dbService.saveAsTemplate(id, { title, category, description });
    return res.status(201).json({ success: true, template });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete invitation
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    dbService.deleteInvitation(id);
    return res.json({ success: true, message: 'Invitation deleted' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
