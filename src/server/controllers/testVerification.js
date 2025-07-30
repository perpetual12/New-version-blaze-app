const User = require('../models/User.cjs');
const mongoose = require('mongoose');

const testVerification = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email parameter is required' 
      });
    }

    // Check in both collections
    const [user, unverifiedUser] = await Promise.all([
      User.findOne({ email }),
      mongoose.connection.db.collection('unverifiedusers').findOne({ email })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        email,
        inUsersCollection: !!user,
        inUnverifiedUsersCollection: !!unverifiedUser,
        user: user ? {
          _id: user._id,
          isVerified: user.isVerified,
          email: user.email,
          username: user.username,
          createdAt: user.date
        } : null,
        unverifiedUser: unverifiedUser ? {
          _id: unverifiedUser._id,
          email: unverifiedUser.email,
          username: unverifiedUser.username,
          verificationExpires: unverifiedUser.verificationExpires
        } : null
      }
    });
  } catch (error) {
    console.error('Test verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking verification status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = testVerification;
