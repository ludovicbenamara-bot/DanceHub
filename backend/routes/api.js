const express = require('express');
const router = express.Router();
const { teachers, bookings } = require('../mockData');

// GET all teachers (with simple filters)
router.get('/teachers', (req, res) => {
    const { style, query } = req.query;
    let results = teachers;

    if (style) {
        results = results.filter(t => t.styles.some(s => s.toLowerCase() === style.toLowerCase()));
    }

    if (query) {
        const q = query.toLowerCase();
        results = results.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.styles.some(s => s.toLowerCase().includes(q)) ||
            t.location.toLowerCase().includes(q)
        );
    }

    res.json(results);
});

// GET teacher by id
router.get('/teachers/:id', (req, res) => {
    const teacher = teachers.find(t => t.id === req.params.id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
});

// POST create booking
router.post('/bookings', (req, res) => {
    const { teacherId, studentName, date, time } = req.body;
    if (!teacherId || !studentName || !date || !time) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const newBooking = {
        id: `b-${Date.now()}`,
        teacherId,
        studentName, // Simplified, usually userId
        date,
        time,
        status: 'confirmed',
        createdAt: new Date()
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
});

// GET my bookings (mocked for "current user")
router.get('/my-bookings', (req, res) => {
    // Return all for demo
    res.json(bookings);
});

module.exports = router;
