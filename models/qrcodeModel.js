const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Reference to the Order model
    required: true
  },
  qrCodeData: {
    type: String,
    required: true
  }
});

const QRCodeModel = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCodeModel;
