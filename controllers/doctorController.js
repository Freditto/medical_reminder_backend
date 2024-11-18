// doctorController.js
const Doctor = require('../models/doctorModel');

const doctorController = {
  // Create a new doctor
  createDoctor: async (req, res) => {
    try {
      const doctor = await Doctor.create(req.body);
      res.status(201).json({ message: 'Doctor created successfully', data: doctor });
    } catch (error) {
      console.error('Error in creating doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get all doctors
  getDoctors: async (req, res) => {
    try {
      const doctors = await Doctor.find();
      res.json({ data: doctors });
    } catch (error) {
      console.error('Error in fetching doctors:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get doctor by ID
  getDoctorById: async (req, res) => {
    const userId = req.params.id;
    try {
        const doctor = await Doctor.findOne({ user: userId });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json({ data: doctor });
    } catch (error) {
      console.error('Error in fetching doctor by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update doctor by ID
  updateDoctor: async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json({ message: 'Doctor updated successfully', data: doctor });
    } catch (error) {
      console.error('Error in updating doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete doctor by ID
  deleteDoctor: async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json({ message: 'Doctor deleted successfully', data: doctor });
    } catch (error) {
      console.error('Error in deleting doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

   // Get consultation requests for a doctor
   getConsultationRequests: async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id).populate('consultations');
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json({ data: doctor.consultations });
    } catch (error) {
      console.error('Error in fetching consultation requests for doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get appointments for a doctor
  getAppointments: async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id).populate('appointments');
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json({ data: doctor.appointments });
    } catch (error) {
      console.error('Error in fetching appointments for doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = doctorController;
