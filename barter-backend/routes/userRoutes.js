const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');
const generateToken = require('../utils/generateToken');

// 🔐 Protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Welcome back, ${req.user.email}` });
});

// Example backend route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});
// // 📝 Register route
// router.post('/register', async (req, res) => {
//   const { name, email, password, skillsOffered, skillsWanted } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10); // Ensure password is hashed
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       skillsOffered,
//       skillsWanted,
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// 🔓 Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user); // Use your helper function

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // ✅ Token returned here!
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;







































// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const authenticateToken = require('../middleware/authMiddleware');
// const generateToken = require('../utils/generateToken');

//     // Protected route
// router.get('/profile', authenticateToken, (req, res) => {
//   res.status(200).json({ message: `Welcome back, ${req.user.email}` });
// });


// // POST /api/users/register
// router.post('/register', async (req, res) => {
//   const { name, email, password, skillsOffered, skillsWanted } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create and save new user
//     const newUser = new User({ name, email, password, skillsOffered, skillsWanted });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// module.exports = router;

// // Login Route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
    

//     res.status(200).json({ message: 'Login successful' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });
