const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Add validation helper functions
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{10,}$/;

const authController = {
  signup: async (req, res) => {
    const { email, password } = req.body;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    
    if (!pwRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 10 characters, include uppercase, lowercase, number, and special character." });
    }
    
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return res.status(409).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      // Default every signup to 'user' role.
      const newUser = new Admin({ email, password: hashedPassword, role: 'user' });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully. Contact app owner for admin access.' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: 'User not found' });

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

      // Send through whatever the current role is in MongoDB Atlas ('email' or 'admin')
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;
