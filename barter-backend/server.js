// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Check for required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'barter',
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Basic route to confirm server is running
app.get('/', (req, res) => {
  res.send('Barter backend is running 🚀');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
