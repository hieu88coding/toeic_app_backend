const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');
const unzipAndUploadToFirebase = require('../extractFile')


// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const exel = data.find(obj => obj.dataType === 'exel').fileUrl;
        const images = data.find(obj => obj.dataType === 'jpg').fileUrl;
        const audio = data.find(obj => obj.dataType === 'mp3').fileUrl;
        const answer = data.find(obj => obj.dataType === 'json').fileUrl;
        const exelFolderUrl = await unzipAndUploadToFirebase(exel, 'exel', req.body.testName);
        const audioFolderUrl = await unzipAndUploadToFirebase(audio, 'mp3', req.body.testName);
        const imagesFolderUrl = await unzipAndUploadToFirebase(images, 'jpg', req.body.testName);

        const test = await db.MockTest.create({
            testName: req.body.testName,
            pdf: exelFolderUrl,
            images: imagesFolderUrl,
            audiomp3: audioFolderUrl,
            correctAnswer: answer,
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
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