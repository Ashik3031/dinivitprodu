import express from 'express';
import { dbService } from '../db';

const router = express.Router();

// List all business accounts (Admin only)
router.get('/users', (req, res) => {
  try {
    const users = dbService.getUsers();
    // Attach invitation count for each business
    const invitations = dbService.getInvitations(undefined, 'admin');
    const usersWithCount = users.map(u => ({
      ...u,
      invitationCount: invitations.filter(i => i.businessId === u.id).length
    }));
    return res.json({ users: usersWithCount });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new business account (Admin only - No public signup)
router.post('/users', (req, res) => {
  try {
    const { username, password, businessName, ownerName, email, phone, role } = req.body;

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

    const newUser = dbService.createUser({
      username,
      password,
      businessName,
      ownerName,
      email,
      phone: phone || '',
      role: role || 'business',
      isActive: true
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
    const updated = dbService.updateUser(id, updates);
    return res.json({ success: true, user: updated, message: 'Account updated successfully.' });
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
      message: `Password reset successfully for ${updated.businessName}. Give the new password to the business owner.`
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
