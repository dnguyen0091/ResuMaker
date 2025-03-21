const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Assuming you have a User model in the 'models' directory

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required.' });
    }

    try {
        // Debugging: Log login attempt
        console.log(`Login attempt for: ${email}`);

        // Query the database for the user
        const user = await User.findOne({ email }).lean();

        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(404).json({ error: 'User not found.' });
        }

        // Debugging: Check retrieved user
        console.log('User found:', user);

        if (password === user.password) { // No password hashing for now
            res.status(200).json({
                message: 'Login successful.',
                user: {
                    ID: user._id,
                    FirstName: user.firstName,
                    LastName: user.lastName,
                    Login: user.login
                }
            });
        } else {
            console.log('Invalid password');
            res.status(401).json({ error: 'Invalid password.' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
});

module.exports = router;