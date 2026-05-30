const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const SECRET_KEY = 'itprephub_secret_2024';

// REGISTER
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.json({ 
            success: false, 
            message: 'Sab fields bharo!' 
        });
    }

    // Password encrypt karo
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            return res.json({ 
                success: false, 
                message: 'Email already registered!' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Registration successful!' 
        });
    });
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ 
            success: false, 
            message: 'Need Both Email and password!' 
        });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.json({ 
                success: false, 
                message: 'User nahi mila!' 
            });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.json({ 
                success: false, 
                message: 'Password galat hai!' 
            });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token: token,
            user: { 
                id: user.id, 
                name: user.name,
                email: user.email
            }
        });
    });
});

module.exports = router;