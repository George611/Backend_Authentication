const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// =========================
// Test Route
// =========================
router.get('/test', (req, res) => {
    res.send('Auth route works!');
});

// =========================
// Register Route
// =========================
router.post('/register', async (req, res) => {
    console.log('Register request body:', req.body);
    const { first_name, email, password } = req.body;

    try {
        // Check if user already exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.execute(
            'INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)',
            [first_name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('REGISTER ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

// =========================
// Login Route
// =========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                email: user.email
            }
        });

    } catch (err) {
        console.error('LOGIN ERROR:', err); // Full error logged in terminal
        res.status(500).json({ message: err.message }); // Show exact error in Postman
    }
});

module.exports = router;
