const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');


// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const images = data.find(obj => obj.dataType === 'pdf').fileUrl;
        const audio = data.find(obj => obj.dataType === 'mp3').fileUrl;
        const answer = data.find(obj => obj.dataType === 'json').fileUrl;
        const folderUrl = await handlePdf(images, req.body.testName);
        const test = await db.Listening.create({
            level: req.body.level,
            testName: req.body.testName,
            pdf: images,
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
        res.status(500).json({ message: 'Failed to create Listening.' });
    }

});

// Get all Listenings
router.get('/', async (req, res) => {
    try {
        const Listenings = await db.Listening.findAll();
        res.json(Listenings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Listenings.' });
    }
});

// Get Listening by ID
router.get('/:id/:level', async (req, res) => {
    try {
        const Listening = await db.Listening.findOne({
            where: {
                testName: req.params.id,
                level: req.params.level
            }
        })
        if (!Listening) {
            res.status(404).json({ message: 'Listening not found.' });
        } else {
            res.json(Listening);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Listening.' });
    }
});

// Update Listening by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Listening.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Listening not found.' });
        } else {
            const Listening = await Listening.findByPk(req.params.id);
            res.json(Listening);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Listening.' });
    }
});

// Delete Listening by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Listening.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Listening not found.' });
        } else {
            res.json({ message: 'Listening deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Listening.' });
    }
});

module.exports = router;