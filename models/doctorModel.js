// doctorModel.js
const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    hospitalName: {
        type: String,
        required: true
      },
    specialty: {
      type: String,
      required: true
    },
    imageUrl: String, // URL of the doctor's image
    consultations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation'
    }],
    appointments: [{
      patientName: {
        type: String,
        required: true
      },
      appointmentDate: {
        type: Date,
        required: true
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
  
  const Doctor = mongoose.model('Doctor', doctorSchema);
  
  module.exports = Doctor;