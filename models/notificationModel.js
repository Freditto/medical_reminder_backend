// notificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['RefillRequest', 'ConsultationReply', 'AppointmentAccepted'],
    required: true
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  status: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending'],
    default: 'Pending'
  },
  details: String,
  response: String  // Add a field to store the response content
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
