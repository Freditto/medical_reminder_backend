// models/medicationModel.js
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  stocks: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String // URL of the medicine's image
  }
});

module.exports = medicationSchema;