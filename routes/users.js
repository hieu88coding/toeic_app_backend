// src/routes/user.js
const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
// const User = require('../models/user');

// Create a new user
router.post('/', async (req, res) => {
    try {
        const user = await db.User.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const user = await db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
});

// Update user by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            const user = await User.findByPk(req.params.id);
            res.json(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.User.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.json({ message: 'User deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
});

module.exports = router;