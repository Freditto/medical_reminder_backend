// pharmacyRoutes.js
const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

// Pharmacy routes
router.post('/pharmacies', pharmacyController.createPharmacy);
router.get('/pharmacies', pharmacyController.getPharmacies);
router.get('/pharmacies/:id', pharmacyController.getPharmacyById);
router.put('/pharmacies/:id', pharmacyController.updatePharmacy);
router.delete('/pharmacies/:id', pharmacyController.deletePharmacy);

// Route to add medicines to the pharmacy's inventory
router.post('/pharmacies/:id/inventory', pharmacyController.addToInventory);

// Route for processing refill requests
router.post('/pharmacies/:id/refill-requests/:refillRequestId/process', pharmacyController.processRefillRequest);

// New routes for pharmacy inventory management
router.get('/pharmacies/:id/inventory', pharmacyController.getInventoryByPharmacyId);
router.put('/pharmacies/:id/inventory/:itemId', pharmacyController.updateInventoryItem);
router.delete('/pharmacies/:id/inventory/:itemId', pharmacyController.deleteInventoryItem);

// Route for selling medicines
router.post('/pharmacies/:id/sell', pharmacyController.sellMedicines);

// New route for handling QR code scanning
// New route for handling order completion by pharmacy
router.post('/pharmacies/:pharmacyId/orders/:orderId/complete', pharmacyController.completeOrder);

// New route to view refill requests
router.get('/pharmacies/:pharmacyId/refillRequests', pharmacyController.getRefillRequests);


module.exports = router;
