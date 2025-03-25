// Outdated
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');  // Import the login routes
const User = require('./models/User');
const app = express();
const port = 3000;

// MongoDB connection configuration
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
})
    .then(async () => {
        console.log('Connected to MongoDB');
        const users = await User.find().lean();
        console.log('Users in DB:', users);
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

    // Fetch all users from the database
// Fetch all users from the database using async/await
app.get('/users', async (req, res) => {
    try {
      const users = await User.find(); // Using the User model to query 'Users' collection
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Get request for all of a user's resumes
app.get('/user/:email/resumes', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Cors for postman
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// Use the authRoutes file for authentication routes
app.use('/auth', authRoutes); 

// Use resumeRoutes to upload resumes
app.use('/user', resumeRoutes);
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});