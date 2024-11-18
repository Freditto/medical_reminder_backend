// patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient routes
router.post('/patients', patientController.createPatient);
router.get('/patients', patientController.getPatients);
router.get('/patients/:id', patientController.getPatientById);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

router.post('/patients/:id/consultations', patientController.requestConsultation);
router.post('/patients/:id/refills', patientController.requestRefill);

module.exports = router;
