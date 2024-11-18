// consultationModel.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medications: [{
    medicationName: {
      type: String,
      required: true
    },
    dosage: String,
    imageUrl: String
  }],
  medicalCondition: String,
  allergies: String,
  sideEffects: String,
  appointmentDate: Date,
  prescription: String,
  status: {
    type: String,
    enum: ['Pending', 'Replied', 'Rejected'],
    default: 'Pending'
  },
  prescriptionImage: String, // URL of the prescription image
  consultationNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
