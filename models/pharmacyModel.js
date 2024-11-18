const mongoose = require('mongoose');
const medicationSchema = require('./medicationModel'); // Import the medication schema

const pharmacySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    pharmacy: {
      type: String,
      required: true
    },
    imageUrl: String,
    location: {
      type: String,
    },
    inventory: [medicationSchema], // Medication details included in inventory
    refillRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }],
    notifications: [{
      type: {
        type: String,
        required: true
      },
      details: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Unread'
      }
    }]
  });
  
  const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
  
  module.exports = Pharmacy;
