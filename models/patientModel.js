// patientModel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true
      
    },
    medications: [{
      medicationName: {
        type: String,
        required: true
      },
      dosage: String,
      frequency: String,
      reminders: [{
        reminderTime: {
          type: Date,
          required: true
        },
        message: String
      }]
    }],
    medicalConditions: [String],
    allergies: [String],
    medicationHistory: [String],
    sideEffects: [String],
    consultationRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation' // Reference to the Consultation model
    }],
    refillRequests: [{
      pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy'
      },
      medications: [{
        medicationName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }],
      message: String,
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
      }
    }],
    notifications: [{
        type: {
          type: String, // Type of notification
          required: true
        },
        details: {
          type: String, // Details of the notification
          required: true
        },
        status: {
          type: String, // Status of the notification (e.g., Unread, Read)
          default: 'Unread'
        }
      }]
  });
  
const Patient = mongoose.model('Patient', patientSchema);
  
module.exports = Patient;
