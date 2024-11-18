const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

// Create a new consultation
router.post('/consultations', consultationController.createConsultation);

// Get all consultations
router.get('/consultations', consultationController.getConsultations);

// Get consultation by ID
router.get('/consultations/:id', consultationController.getConsultationById);

// Update consultation by ID
router.put('/consultations/:id', consultationController.updateConsultation);

// Delete consultation by ID
router.delete('/consultations/:id', consultationController.deleteConsultation);

// Reply to consultation by ID
router.put('/consultations/:consultationId/reply', consultationController.replyToConsultation);

module.exports = router;
