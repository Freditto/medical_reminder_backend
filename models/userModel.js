// UserModel.js
const mongoose = require('mongoose');

// Define role constants
const ROLES = {
  ADMIN: 0,
  PATIENT: 1,
  DOCTOR: 2,
  PHARMACIST: 3
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
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
  role: {
    type: Number,
    enum: Object.values(ROLES),
    required: true
  },
  
});

// Add a virtual field to get role name
userSchema.virtual('roleName').get(function() {
  switch (this.role) {
    case ROLES.ADMIN:
      return 'Admin';
    case ROLES.PATIENT:
      return 'Patient';
    case ROLES.DOCTOR:
      return 'Doctor';
    case ROLES.PHARMACIST:
      return 'Pharmacist';
    default:
      return 'Patient';
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
