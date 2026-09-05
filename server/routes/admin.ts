import express from 'express';
import { dbService } from '../db';
import { authMiddleware, requireAdmin, optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

// List all business accounts with comprehensive invitation breakdown
router.get('/users', (req, res) => {
  try {
    const users = dbService.getUsers();
    // Attach invitation count and metrics for each business
    const invitations = dbService.getInvitations(undefined, 'admin');
    const usersWithCount = users.map(u => {
      const userInvs = invitations.filter(i => i.businessId === u.id);
      const publishedCount = userInvs.filter(i => i.status === 'published').length;
      const draftCount = userInvs.filter(i => i.status === 'draft').length;
      const totalViews = userInvs.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

      return {
        ...u,
        invitationCount: userInvs.length,
        publishedCount,
        draftCount,
        totalViews
      };
    });
    return res.json({ users: usersWithCount });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new business account (Admin only - No public signup)
router.post('/users', (req, res) => {
  try {
    const { username, password, businessName, ownerName, email, phone, role, maxInvitations, brandColor, customDomain } = req.body;

    if (!username || !password || !businessName || !ownerName || !email) {
      return res.status(400).json({
        error: 'Missing required fields: username, password, businessName, ownerName, and email are mandatory.'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const newUser = dbService.createUser({
      username: username.trim(),
      password: password.trim(),
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      role: role === 'admin' ? 'admin' : 'business',
      isActive: true,
      maxInvitations: maxInvitations ? Number(maxInvitations) : 50,
      brandColor: brandColor || '#1e293b',
      customDomain: customDomain ? customDomain.trim() : undefined
    });

    return res.status(201).json({
      success: true,
      user: newUser,
      message: `Account for "${businessName}" created successfully. You can now share credentials with the business owner.`
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Update business account
router.put('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
    }

    const updated = dbService.updateUser(id, updates);
    return res.json({ success: true, user: updated, message: 'Account updated successfully.' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Toggle activate/deactivate user
router.put('/users/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const target = dbService.getUserById(id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role === 'admin' && !isActive) {
      return res.status(400).json({ error: 'Cannot deactivate the super administrator account.' });
    }

    const updated = dbService.updateUser(id, { isActive: Boolean(isActive) });
    return res.json({
      success: true,
      user: updated,
      message: `Account for "${updated.businessName}" is now ${updated.isActive ? 'Active' : 'Deactivated'}.`
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Reset password for a business account
router.post('/users/:id/reset-password', (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 5) {
      return res.status(400).json({ error: 'New password must be at least 5 characters long.' });
    }

    const updated = dbService.updateUser(id, { password: newPassword });
    return res.json({
      success: true,
      message: `Password reset successfully for ${updated.businessName} (${updated.username}).`
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete business account
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    dbService.deleteUser(id);
    return res.json({ success: true, message: 'Business account and associated invitations deleted.' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Get system overview statistics
router.get('/stats', (req, res) => {
  try {
    const stats = dbService.getSystemStats();
    return res.json({ stats });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

