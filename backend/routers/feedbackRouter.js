const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel');
const verifyToken = require('../middlewaves/verify.Token');

router.post('/', verifyToken, async (req, res) => {
  console.log('Received feedback:', req.body);
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get name from decoded token
    const name = req.user.name;
    if (!name) {
      return res.status(400).json({ error: 'User name not found in token' });
    }

    const feedback = await Feedback.create({ 
      name,
      message 
    });
    
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

router.get('/getall',(req,res)=>{
    Feedback.find()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;
