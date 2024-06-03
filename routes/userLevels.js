const db = require('../models/index.js');
const express = require('express');
const UserLevel = require('../models/userLevel.js');
const router = express.Router();

// Create a new test
router.post('/', async (req, res) => {
    try {
        const test = await db.UserLevel.create({
            userId: req.body.userId,
            levelName: req.body.levelName,
            levelStart: req.body.levelStart,
            levelEnd: req.body.levelEnd,
        });

        res.json({
            message: 'Lưu level vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create UserLevel.' });
    }

});

// Get all UserLevels
router.get('/', async (req, res) => {
    try {
        const UserLevels = await db.UserLevel.findAll();
        res.json(UserLevels);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch UserLevels.' });
    }
});


router.get('/:userId', async (req, res) => {
    try {
        const UserLevel = await db.UserLevel.findOne({
            where: {
                userId: req.params.userId
            }
        })
        if (!UserLevel) {
            res.status(404).json({ message: 'UserLevel not found.' });
        } else {
            res.json(UserLevel);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch UserLevel.' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.UserLevel.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'UserLevel not found.' });
        } else {
            res.json({ message: 'UserLevel deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete UserLevel.' });
    }
});


module.exports = router;