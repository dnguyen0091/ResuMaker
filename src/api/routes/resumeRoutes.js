//const express = require('express');
//const multer = require('multer');
//const User = require('../models/User');
//const path = require('path');
import express from 'express';
import multer from 'multer';
import User from '../models/User.js';
import path from 'path';

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: './uploads/resumes/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Resume Upload Endpoint
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded.' });

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email}, 
            { 
                $push: {  // <-- Use $push to append to the `resumes` array
                    resumes: {
                        fileName: file.filename,
                        filePath: `/uploads/resumes/${file.filename}`,
                        uploadedAt: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: 'User not found.' });

        res.status(200).json({
            message: 'Resume uploaded successfully.',
            resume: updatedUser.resumes
        });

    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
});

export default router; // Export the router