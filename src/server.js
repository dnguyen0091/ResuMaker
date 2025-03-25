import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./api/routes/authRoutes.js";
import resumeRoutes from "./api/routes/resumeRoutes.js";

// MongoDB connection configuration
dotenv.config();
connectDB();

// Configure express
const app = express();
app.use(express.json());
app.use(cors());

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

// Use the authRoutes file for authentification routes
app.use("/api/auth", authRoutes);

// Use the resumeRoutes to upload resumes
app.use('/user', resumeRoutes);

// Start the server
const PORT = process.env.PORT || 500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});