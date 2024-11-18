// userController.js
const jwt = require('jsonwebtoken'); // Add this line to import jsonwebtoken package
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const userController = {
  // Create a new user
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ message: 'User created successfully', data: user });
    } catch (error) {
      console.error('Error in creating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json({ data: users });
    } catch (error) {
      console.error('Error in fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ data: user });
    } catch (error) {
      console.error('Error in fetching user by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update user by ID
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully', data: user });
    } catch (error) {
      console.error('Error in updating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete user by ID
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully', data: user });
    } catch (error) {
      console.error('Error in deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // User registration
  registerUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await User.create({ username, email, password: hashedPassword, role });
      
      res.status(201).json({ message: 'User registered successfully', data: newUser });
    } catch (error) {
      console.error('Error in user registration:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // User login
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Password is correct, generate token
      const token = jwt.sign({ userId: user._id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

      // Return token along with user data
      res.json({ message: 'Login successful', token, data: user });
    } catch (error) {
      console.error('Error in user login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

};

module.exports = userController;
