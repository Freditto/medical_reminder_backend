const Consultation = require('../models/consultationModel');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');

const consultationController = {
  // Create a new consultation
  createConsultation: async (req, res) => {
    try {
      const consultation = await Consultation.create(req.body);
      const doctorId = req.body.doctor; // Assuming the doctor ID is provided in the request body
      const patientId = req.body.patient; // Assuming the patient ID is provided in the request body
  
      // Update patient record with consultation request
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      patient.consultationRequests.push(consultation._id); // Push consultation ID to patient's consultationRequests
      await patient.save();
  
      // Create a notification for the doctor
      const doctor = await Doctor.findById(doctorId);
      if (doctor) {
        doctor.notifications.push({
          type: 'ConsultationRequest',
          details: "You have a new consultation request.",
          status: 'Unread'
        });
        await doctor.save();
      }
  
      res.status(201).json({ message: 'Consultation created successfully', data: consultation });
    } catch (error) {
      console.error('Error creating consultation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  
  

  // Get all consultations
  getConsultations: async (req, res) => {
    try {
      const consultations = await Consultation.find();
      res.json({ data: consultations });
    } catch (error) {
      console.error('Error fetching consultations:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // // Get consultation by ID
  // getConsultationById: async (req, res) => {
  //   const userId = req.params.id;
  //   try {
  //       const consultation = await Consultation.findOne({ doctor: userId });
  //     if (!consultation) {
  //       return res.status(404).json({ message: 'Consultation not found' });
  //     }
  //     res.json({ data: consultation });
  //   } catch (error) {
  //     console.error('Error fetching consultation by ID:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },

  // Get consultations by doctor ID
  getConsultationById: async (req, res) => {
  const userId = req.params.id;
  try {
    const consultations = await Consultation.find({ doctor: userId });
    if (!consultations || consultations.length === 0) {
      return res.status(404).json({ message: 'Consultations not found' });
    }
    res.json({ data: consultations });
  } catch (error) {
    console.error('Error fetching consultations by doctor ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

  // Update consultation by ID
  updateConsultation: async (req, res) => {
    try {
      const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }
      res.json({ message: 'Consultation updated successfully', data: consultation });
    } catch (error) {
      console.error('Error updating consultation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete consultation by ID
  deleteConsultation: async (req, res) => {
    try {
      const consultation = await Consultation.findByIdAndDelete(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }
      res.json({ message: 'Consultation deleted successfully', data: consultation });
    } catch (error) {
      console.error('Error deleting consultation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Reply to consultation
  replyToConsultation: async (req, res) => {
    try {
      const { consultationId } = req.params;
      const { status, prescription, prescriptionImage, consultationNotes } = req.body;

      // Find the consultation by ID
      const consultation = await Consultation.findById(consultationId);
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }

      // Check if the consultation status can be updated
      if (consultation.status !== 'Pending') {
        return res.status(400).json({ message: 'Consultation status cannot be changed' });
      }

      // Update the consultation fields based on the doctor's reply
      consultation.status = 'Replied'; // Set status to "Replied"
      consultation.prescription = prescription;
      consultation.prescriptionImage = prescriptionImage;
      consultation.consultationNotes = consultationNotes;

      // Save the changes to the consultation
      await consultation.save();

      // Create a notification for the patient
      const patient = await Patient.findById(consultation.patient);
      const doctor = await Doctor.findById(req.body.doctor);
      console.log(doctor);
      console.log(patient);
      if (patient) {
        patient.notifications.push({
          type: 'Consultation Reply',
          details: `Your consultation with ${doctor.name} has been replied.`,
          status: 'Unread'
        });
        await patient.save();
      }

      res.json({ message: 'Consultation replied successfully', data: consultation });
    } catch (error) {
      console.error('Error replying to consultation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = consultationController;
