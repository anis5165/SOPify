const express = require('express');
const router = express.Router();
const Model = require('../models/sopModel'); 
const upload = require('../middlewaves/multerConfig');
const path = require('path');
const jwt = require('jsonwebtoken'); // Add this import
require('dotenv').config();

// Add a new SOP with image upload
router.post('/add', upload.single('image'), (req, res) => {
    console.log(req.body);
    
    // Check if file was uploaded
    let imageData = null;
    if (req.file) {
        console.log('File uploaded:', req.file);
        imageData = {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
            size: req.file.size
        };
    }
    
    // Create new SOP with image data if available
    const newSop = new Model({
        title: req.body.title,
        description: req.body.description,
        image: imageData,
        createdBy: req.body.userId || null
    });

    newSop.save()
        .then((result) => {
            res.status(200).json({
                success: true,
                message: 'SOP created successfully',
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to create SOP',
                error: err.message
            });
        });
});

// Add a new SOP from extension with base64 images
router.post('/add-from-extension', (req, res) => {
    console.log('Received SOP from extension');
    console.log(req.body);
    
    // Validate request
    if (!req.body.title || !req.body.description || !req.body.steps) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    // Extract user ID from token if authenticated
    let userId = null;
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded._id;
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }
    
    // Create new SOP
    const newSop = new Model({
        title: req.body.title,
        description: req.body.description,
        steps: req.body.steps,
        fromExtension: true,
        url: req.body.url,
        timestamp: req.body.timestamp || Date.now(),
        createdBy: userId || req.body.createdBy
    });

    newSop.save()
        .then((result) => {
            res.status(200).json({
                success: true,
                message: 'SOP created successfully from extension',
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to create SOP',
                error: err.message
            });
        });
});

// Get all SOPs
router.get('/getall', (req, res) => {
    Model.find().sort({ updatedAt: -1 }) // Sort by most recently updated
        .then((result) => {
            res.status(200).json({
                success: true,
                count: result.length,
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve SOPs',
                error: err.message
            });
        });
});

// Get SOPs by user ID and source (extension)
router.get('/getbyuser/:userId', (req, res) => {
    const userId = req.params.userId;
    const source = req.query.source; // 'extension' or undefined for all
    
    console.log(`Fetching SOPs for user: ${userId}, source: ${source || 'all'}`);
    
    // Build query
    const query = { createdBy: userId };
    
    // If source is specified, add it to the query
    if (source === 'extension') {
        query.fromExtension = true;
    }
    
    Model.find(query).sort({ updatedAt: -1 }) // Sort by most recently updated
        .then((result) => {
            res.status(200).json({
                success: true,
                count: result.length,
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve SOPs for user',
                error: err.message
            });
        });
});

// Get SOP by ID
router.get('/getbyid/:id', (req, res) => {
    console.log(req.params.id);
    Model.findById(req.params.id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'SOP not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve SOP',
                error: err.message
            });
        });
});

// Serve SOP image
router.get('/image/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            if (!result || !result.image || !result.image.path) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            // Send the image file
            res.sendFile(path.resolve(result.image.path));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve image',
                error: err.message
            });
        });
});

// Update SOP by ID with optional image upload
router.put('/update/:id', upload.single('image'), (req, res) => {
    console.log('ID:', req.params.id);
    console.log('Updated Data:', req.body);
    
    // Prepare update data
    const updateData = {
        title: req.body.title,
        description: req.body.description,
        updatedAt: Date.now()
    };
    
    // Check if a new image was uploaded
    if (req.file) {
        updateData.image = {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
            size: req.file.size
        };
    }

    Model.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'SOP not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'SOP updated successfully',
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to update SOP',
                error: err.message
            });
        });
});

// Delete SOP by ID
router.delete('/delete/:id', (req, res) => {
    // First find the SOP to get the image path if it exists
    Model.findById(req.params.id)
        .then((sop) => {
            if (!sop) {
                return res.status(404).json({
                    success: false,
                    message: 'SOP not found'
                });
            }
            
            // Delete the SOP from the database
            return Model.findByIdAndDelete(req.params.id)
                .then((result) => {
                    // If there was an image, try to delete the file
                    if (sop.image && sop.image.path) {
                        try {
                            const fs = require('fs');
                            if (fs.existsSync(sop.image.path)) {
                                fs.unlinkSync(sop.image.path);
                                console.log('Image file deleted:', sop.image.path);
                            }
                        } catch (err) {
                            console.error('Error deleting image file:', err);
                            // Continue even if image deletion fails
                        }
                    }
                    
                    res.status(200).json({
                        success: true,
                        message: 'SOP deleted successfully',
                        data: result
                    });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to delete SOP',
                error: err.message
            });
        });
});

module.exports = router;