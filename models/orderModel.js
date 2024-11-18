const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  medications: [{
    medicationName: String,
    quantity: Number,
    status: String,
    reason: String
  }],
  status: {
    type: String,
    default: 'Pending'
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
