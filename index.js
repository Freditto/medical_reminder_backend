// index.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path'); 
const cors = require('cors')
const doctorRoutes = require('./routes/doctorRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const consultationRoutes = require('./routes/consultationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/medical_helper', {useNewUrlParser: true}).then (() => {
    console.log('connected to database successfully')
  }).catch((error) => {
    console.error('Error connecting to the database:', err);
});


// Multer setup for file uploads
const fileStorage = multer.diskStorage({
    destination:(req,file,cb) =>{
      cb(null, "uploads")
    },
    filename:(req, file, cb) => {
      cb(null, new Date().toDateString() + "-" + file.originalname)
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" ||file.mimetype === "image/jpeg"  ){
      cb(null, true)
    }else{
      cb(null, false)
    }
  }

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter }).any());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api', doctorRoutes);
app.use('/api', userRoutes);
app.use('/api', patientRoutes);
app.use('/api', pharmacyRoutes);
app.use('/api', consultationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
