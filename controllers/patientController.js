// patientController.js
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Pharmacy = require('../models/pharmacyModel');
const QRCode = require('qrcode');
const Order = require('../models/orderModel');
const QRCodeModel = require('../models/qrcodeModel'); // Import the QRCodeModel

const patientController = {
  // Create a new patient
  createPatient: async (req, res) => {
    try {
      const patient = await Patient.create(req.body);
      res.status(201).json({ message: 'Patient created successfully', data: patient });
    } catch (error) {
      console.error('Error in creating patient:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get all patients
  getPatients: async (req, res) => {
    try {
      const patients = await Patient.find();
      res.json({ data: patients });
    } catch (error) {
      console.error('Error in fetching patients:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get patient by ID
 // Get patient by ID
getPatientById: async (req, res) => {
  const userId = req.params.id;
  try {
    const patient = await Patient.findOne({ user: userId })
      .populate({
        path: 'consultationRequests',
        populate: {
          path: 'doctor',
          select: 'name' // Populate only doctor's name
        }
      })
      .populate({
        path: 'refillRequests',
        populate: {
          path: 'orderId', // Populate the order details
          select: '-qrCodeData' // Exclude the QR code data
        }
      });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Fetch the QR code data separately and attach it to the refill requests
    const refillRequests = patient.refillRequests.map(async (request) => {
      const qrCodeEntry = await QRCodeModel.findOne({ orderId: request.orderId });
      return {
        ...request.toJSON(),
        qrCodeData: qrCodeEntry ? qrCodeEntry.qrCodeData : null
      };
    });

    // Resolve all promises and set the modified refill requests
    patient.refillRequests = await Promise.all(refillRequests);

    res.json({ data: patient });
  } catch (error) {
    console.error('Error in fetching patient by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},



  

  // Update patient by ID
  updatePatient: async (req, res) => {
    try {
      const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json({ message: 'Patient updated successfully', data: patient });
    } catch (error) {
      console.error('Error in updating patient:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete patient by ID
  deletePatient: async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json({ message: 'Patient deleted successfully', data: patient });
    } catch (error) {
      console.error('Error in deleting patient:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Request consultation
  requestConsultation: async (req, res) => {
    try {
      const { doctorId, message } = req.body;
      
      // Find the patient by ID
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Find the doctor by ID
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Add consultation request to patient's consultationRequests array
      patient.consultationRequests.push({
        doctor: doctorId,
        message,
        status: 'Pending'
      });

      // Save the updated patient
      await patient.save();

      // Save the consultation request to the doctor's consultations array
      doctor.consultations.push({
        patientId: patient._id,
        message,
        status: 'Pending'
      });

      // Save the updated doctor
      await doctor.save();

      res.status(201).json({ message: 'Consultation request sent successfully' });
    } catch (error) {
      console.error('Error in requesting consultation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

 // Request refill
 // Request refill
requestRefill: async (req, res) => {
  try {
    const { pharmacyId, medications, message } = req.body;

    // Find the patient by ID
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the pharmacy by ID
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Create an array to store refill details
    const acceptedMedications = [];
    const orderMedications = [];

    // Loop through each medication in the refill request
    for (const medication of medications) {
      const { medicationName, quantity } = medication;
      const inventoryItem = pharmacy.inventory.find(item => item.medicineName === medicationName);

      // Check if the medication is available in the inventory
      if (inventoryItem && inventoryItem.quantity >= quantity) {
        // Medication is available
        acceptedMedications.push({
          medicationName,
          quantityRequested: quantity,
          status: 'Accepted'
        });

        orderMedications.push({
          medicationName,
          quantity,
          status: 'Accepted'
        });
      }
    }

    // Create the order
    const order = await Order.create({
      patient: req.params.id,
      pharmacy: pharmacyId,
      medications: orderMedications
    });

    // Generate QR code for the accepted medications only
    const qrCodeData = await QRCode.toDataURL(JSON.stringify(acceptedMedications));

    // Save the QR code data
    const qrCodeEntry = new QRCodeModel({
      orderId: order._id,
      qrCodeData: qrCodeData
    });
    await qrCodeEntry.save();

    // Save the accepted refill request in the patient model
    patient.refillRequests.push({
      pharmacy: pharmacyId,
      medications: acceptedMedications.map(({ medicationName, quantityRequested }) => ({
        medicationName,
        quantity: quantityRequested, // Ensure that quantity is provided
        status: 'Accepted'
      })),
      message,
      status: 'Accepted',
      orderId: order._id // Store the order ID for reference
    });
    await patient.save();

    // Create a notification for the pharmacy regarding the refill request
    await pharmacy.notifications.push({ type: 'RefillRequest', details: "You have a new Refill Request" });
    await pharmacy.refillRequests.push(order._id); // Add the order to pharmacy's refill requests
    await pharmacy.save();

    // Return the response with accepted refill details and QR code
    res.status(201).json({
      message: 'Refill request sent successfully',
      data: {
        acceptedMedications,
        orderId: order._id,
        qrCode: qrCodeData // Include QR code data in the response
      }
    });
  } catch (error) {
    console.error('Error in requesting refill:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

  
};

module.exports = patientController;
