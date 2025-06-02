const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

router.post('/', async (req, res) => {
  try {
    const { name, email, detail } = req.body;

    if (!name || !email || !detail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = await Contact.create({ name, email, detail });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
