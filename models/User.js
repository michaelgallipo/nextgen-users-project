const mongoose = require('mongoose');
const permissions = ['administrator', 'content creator', 'community moderator', 'unprivileged'];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
  },
  permission: {
    type: String,
    trim: true,
    enum: {values: permissions, message: '{VALUE} is not valid permission'}
  }
});

module.exports = mongoose.model('User', userSchema);