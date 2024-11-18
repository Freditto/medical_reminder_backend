// pharmacyController.js
const Pharmacy = require('../models/pharmacyModel');
const Patient = require('../models/patientModel');

// Function to calculate medication cost
function calculateMedicationCost(inventoryItem, quantity) {
    // For simplicity, let's assume each unit of medication costs $10
    const costPerUnit = 10;
    return costPerUnit * quantity;
  }
  
  // Function to generate QR code
  function generateQRCode() {
    // Implement your QR code generation logic here
    return 'Generated QR Code';
  }

const pharmacyController = {
  // Create a new pharmacy
  createPharmacy: async (req, res) => {
    try {
      const pharmacy = await Pharmacy.create(req.body);
      res.status(201).json({ message: 'Pharmacy created successfully', data: pharmacy });
    } catch (error) {
      console.error('Error in creating pharmacy:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get all pharmacies
  getPharmacies: async (req, res) => {
    try {
      const pharmacies = await Pharmacy.find();
      res.json({ data: pharmacies });
    } catch (error) {
      console.error('Error in fetching pharmacies:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get pharmacy by ID
  getPharmacyById: async (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try {
        const pharmacy = await Pharmacy.findOne({ user: userId });
        console.log(pharmacy);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      res.json({ data: pharmacy });
    } catch (error) {
      console.error('Error in fetching pharmacy by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update pharmacy by ID
  updatePharmacy: async (req, res) => {
    try {
      const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      res.json({ message: 'Pharmacy updated successfully', data: pharmacy });
    } catch (error) {
      console.error('Error in updating pharmacy:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete pharmacy by ID
  deletePharmacy: async (req, res) => {
    try {
      const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      res.json({ message: 'Pharmacy deleted successfully', data: pharmacy });
    } catch (error) {
      console.error('Error in deleting pharmacy:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Process refill request
  processRefillRequest: async (req, res) => {
    try {
        const { refillRequestId } = req.params;
        const pharmacyId = req.params.id;
    
        // Find the pharmacy by ID
        const pharmacy = await Pharmacy.findById(pharmacyId);
        if (!pharmacy) {
          return res.status(404).json({ message: 'Pharmacy not found' });
        }
    
        const refillRequest = pharmacy.refillRequests.id(refillRequestId);
        if (!refillRequest) {
          return res.status(404).json({ message: 'Refill request not found' });
        }
    
        // Check inventory availability and calculate payment amount
        let totalPaymentAmount = 0;
    
        for (const medication of refillRequest.medications) {
          const inventoryItem = pharmacy.inventory.find(item => item.medicineName === medication.medicationName);
          if (!inventoryItem || inventoryItem.quantity < medication.quantity) {
            // If the medication is not available or the requested quantity exceeds the available quantity
            throw new Error(`Medication "${medication.medicationName}" is not available in sufficient quantity`);
          }
    
          // Deduct from stock
          inventoryItem.quantity -= medication.quantity;
          inventoryItem.stocks -= medication.quantity;
    
          // Calculate payment amount
          totalPaymentAmount += calculateMedicationCost(inventoryItem, medication.quantity);
        }
    
        // Generate QR code
        const qrCode = generateQRCode();
    
        // Update payment amount and QR code in pharmacy model
        pharmacy.paymentAmount = totalPaymentAmount;
        pharmacy.qrCode = qrCode;
    
        // Update refill request status
        refillRequest.status = 'Accepted';
        await pharmacy.save();
    
        // Create a notification for the patient
        const patient = await Patient.findById(refillRequest.patient);
        if (patient) {
          patient.notifications.push({
            type: 'Refill Request Processed',
            details: 'Your refill request has been processed successfully.',
            status: 'Unread'
          });
          await patient.save();
        }
    
        res.status(200).json({
          message: 'Refill request processed successfully',
          paymentAmount: pharmacy.paymentAmount,
          qrCode: pharmacy.qrCode
        });
      } catch (error) {
        console.error('Error in processing refill request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
  },

  // Add medicines to the pharmacy's inventory
  addToInventory: async (req, res) => {
    try {
      const pharmacyId = req.params.id;

      // Find the pharmacy by ID
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }

      // Add the medicines to the inventory
      const medicines = req.body.inventory;
      medicines.forEach(medicine => {
        pharmacy.inventory.push({
          medicineName: medicine.medicineName,
          quantity: medicine.quantity,
          stocks: medicine.stocks || 0,
          sales: medicine.sales || 0
        });
      });

      await pharmacy.save();

      res.status(201).json({ message: 'Medicines added to inventory successfully' });
    } catch (error) {
      console.error('Error in adding medicines to inventory:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Add medicines to the pharmacy's inventory
  addToInventory: async (req, res) => {
    try {
      const pharmacyId = req.params.id;

      // Find the pharmacy by ID
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }

      // Add the medicines to the inventory
      const medicines = req.body.inventory;
      medicines.forEach(medicine => {
        pharmacy.inventory.push({
          medicineName: medicine.medicineName,
          quantity: medicine.quantity,
          stocks: medicine.stocks || 0,
          sales: medicine.sales || 0
        });
      });

      await pharmacy.save();

      res.status(201).json({ message: 'Medicines added to inventory successfully' });
    } catch (error) {
      console.error('Error in adding medicines to inventory:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get pharmacy inventory by pharmacy ID
  getInventoryByPharmacyId: async (req, res) => {
    try {
      const pharmacyId = req.params.id;
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      res.json({ data: pharmacy.inventory });
    } catch (error) {
      console.error('Error in fetching pharmacy inventory:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update inventory item by pharmacy ID and inventory item ID
  updateInventoryItem: async (req, res) => {
    try {
      const { id: pharmacyId, itemId } = req.params;
      const { quantity, stocks, sales } = req.body;
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      const inventoryItem = pharmacy.inventory.id(itemId);
      if (!inventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      if (quantity !== undefined) {
        inventoryItem.quantity = quantity;
      }
      if (stocks !== undefined) {
        inventoryItem.stocks = stocks;
      }
      if (sales !== undefined) {
        inventoryItem.sales = sales;
      }
      await pharmacy.save();
      res.json({ message: 'Inventory item updated successfully', data: inventoryItem });
    } catch (error) {
      console.error('Error in updating inventory item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete inventory item by pharmacy ID and inventory item ID
  deleteInventoryItem: async (req, res) => {
    try {
      const { id: pharmacyId, itemId } = req.params;
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      const inventoryItem = pharmacy.inventory.id(itemId);
      if (!inventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      inventoryItem.remove();
      await pharmacy.save();
      res.json({ message: 'Inventory item deleted successfully', data: inventoryItem });
    } catch (error) {
      console.error('Error in deleting inventory item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Sell medicines from the inventory
  sellMedicines: async (req, res) => {
    try {
      const pharmacyId = req.params.id;
      const { medicines } = req.body; // Assume medicines is an array of { medicineName, quantity }

      // Find the pharmacy by ID
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }

      // Update the inventory
      let allMedicinesAvailable = true;
      medicines.forEach(medicine => {
        const inventoryItem = pharmacy.inventory.find(item => item.medicineName === medicine.medicineName);
        if (!inventoryItem || inventoryItem.quantity < medicine.quantity) {
          allMedicinesAvailable = false;
        } else {
          inventoryItem.quantity -= medicine.quantity;
          inventoryItem.sales += medicine.quantity;
        }
      });

      if (!allMedicinesAvailable) {
        return res.status(400).json({ message: 'One or more medicines are not available in sufficient quantity' });
      }

      await pharmacy.save();

      res.status(200).json({ message: 'Medicines sold successfully' });
    } catch (error) {
      console.error('Error in selling medicines:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Complete order based on QR code
  completeOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { qrCodeData } = req.body; // Assume QR code data is sent in the request body

      // Parse the QR code data to get the accepted medications
      const acceptedMedications = JSON.parse(qrCodeData);

      // Find the order by ID
      const order = await Order.findById(orderId).populate('pharmacy');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if the order is already completed
      if (order.status === 'Completed') {
        return res.status(400).json({ message: 'Order is already completed' });
      }

      // Update the pharmacy inventory based on the accepted medications
      for (const medication of acceptedMedications) {
        const inventoryItem = order.pharmacy.inventory.find(item => item.medicineName === medication.medicineName);

        if (inventoryItem && inventoryItem.quantity >= medication.quantityRequested) {
          inventoryItem.quantity -= medication.quantityRequested;
        } else {
          return res.status(400).json({
            message: `Insufficient stock for ${medication.medicineName}`
          });
        }
      }

      // Save the updated pharmacy inventory
      await order.pharmacy.save();

      // Update the order status to 'Completed'
      order.status = 'Completed';
      await order.save();

      res.status(200).json({ message: 'Order completed successfully' });
    } catch (error) {
      console.error('Error in completing order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getRefillRequests: async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const pharmacy = await Pharmacy.findById(pharmacyId).populate('refillRequests');
  
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
  
      res.status(200).json({ data: pharmacy.refillRequests });
    } catch (error) {
      console.error('Error in fetching refill requests:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
};

module.exports = pharmacyController;
