const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');


// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const images = data.find(obj => obj.dataType === 'pdf').fileUrl;
        const audio = data.find(obj => obj.dataType === 'pdf').fileUrl;
        const answer = data.find(obj => obj.dataType === 'pdf').fileUrl;
        const folderUrl = await handlePdf(images, req.body.testName);
        const test = await db.MockTest.create({
            testName: req.body.testName,
            images: folderUrl,
            audiomp3: audio,
            correctAnswer: answer,
        });
        if (folderUrl) {
            res.json({
                message: 'Cắt file thành công',
                status: 200,
            });
        } else {
            res.json({
                message: 'Cắt file bị hỏng',
                status: 400,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create MockTest.' });
    }

});

// Get all MockTests
router.get('/', async (req, res) => {
    try {
        const MockTests = await db.MockTest.findAll();
        res.json(MockTests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch MockTests.' });
    }
});

// Get MockTest by ID
router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const mockTest = await db.MockTest.findOne({
            where: {
                testName: req.params.id
            }
        })
        if (!mockTest) {
            res.status(404).json({ message: 'MockTest not found.' });
        } else {
            res.json(mockTest);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch MockTest.' });
    }
});

// Update MockTest by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.MockTest.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'MockTest not found.' });
        } else {
            const MockTest = await MockTest.findByPk(req.params.id);
            res.json(MockTest);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update MockTest.' });
    }
});

// Delete MockTest by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.MockTest.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'MockTest not found.' });
        } else {
            res.json({ message: 'MockTest deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete MockTest.' });
    }
});

module.exports = router;