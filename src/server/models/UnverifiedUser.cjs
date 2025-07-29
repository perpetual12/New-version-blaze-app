const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnverifiedUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verificationToken: {
    type: String,
    required: true
  },
  verificationExpires: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours
  },
  lastResendAttempt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Remove unverified users that are older than 24 hours
UnverifiedUserSchema.index(
  { verificationExpires: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model('UnverifiedUser', UnverifiedUserSchema);
