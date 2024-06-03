const db = require('../models/index.js');
const express = require('express');
const partresult = require('../models/partresult.js');
const router = express.Router();
const { sequelize, Sequelize } = require('sequelize');
const partNamesArray = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part71', 'part72', 'part73'];
const dotenv = require('dotenv');
dotenv.config()
const jwt = require('jsonwebtoken');

// Middleware để xác thực token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const tokenWithoutBearer = token.split(' ')[1];
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};
// Create a new test
router.post('/', async (req, res) => {
    try {
        const test = await db.PartResult.create({
            userId: req.body.userId,
            testName: req.body.testName,
            partName: req.body.partName,
            userAnswer: req.body.userAnswer,
            score: req.body.score
        });

        res.json({
            message: 'Lưu lịch sử bài làm vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create PartResult.' });
    }

});

// Get all PartResults
router.get('/', async (req, res) => {
    try {
        const PartResults = await db.PartResult.findAll();
        res.json(PartResults);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch PartResults.' });
    }
});

// Get PartResult by ID
router.get('/latest', async (req, res) => {
    try {
        const PartResult = await db.PartResult.findOne({
            order: [['createdAt', 'DESC']],
        });
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.get('/highestPart', authenticateToken, async (req, res) => {
    try {
        console.log(req.user);
        const PartResult = await db.PartResult.findAll({
            where: {
                partName: partNamesArray,
                userId: req.user.id
            },
            order: [['score', 'DESC']],
            group: ['partName'],
        });
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.get('/:id/:userId', async (req, res) => {
    try {
        const PartResult = await db.PartResult.findOne({
            where: {
                id: req.params.id,
                userId: req.params.userId
            }
        })
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.post('/mocks', async (req, res) => {
    try {
        const test = await db.MockResult.create({
            userId: req.body.userId,
            testName: req.body.testName,
            userAnswer: req.body.userAnswer,
            score: req.body.score
        });

        res.json({
            message: 'Lưu lịch sử bài làm vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create PartResult.' });
    }

});

// Get all PartResults
router.get('/mocks', async (req, res) => {
    try {
        const PartResults = await db.MockResult.findAll();
        res.json(PartResults);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch PartResults.' });
    }
});

// Get PartResult by ID
router.get('/mocksLatest', async (req, res) => {
    try {
        const MockResult = await db.MockResult.findOne({
            order: [['createdAt', 'DESC']],
        });
        console.log(MockResult);
        if (!MockResult) {
            res.status(404).json({ message: 'MockResult not found.' });
        } else {
            res.json(MockResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.get('/mocks/:id/:userId', async (req, res) => {
    try {
        const PartResult = await db.MockResult.findOne({
            where: {
                id: req.params.id,
                userId: req.params.userId
            }
        })
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});



module.exports = router;