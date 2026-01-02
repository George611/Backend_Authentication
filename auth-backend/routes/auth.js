const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/test', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const [rows] = await db.query('SELECT NOW() as now');
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

router.post('/register', async (req, res) => {
    const { first_name, email, password } = req.body;
    const db = req.app.locals.db;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.locals.db;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

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
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
