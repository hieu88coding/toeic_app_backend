const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');


// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const images = data.find(obj => obj.dataType === 'pdf').fileUrl;
        const answer = data.find(obj => obj.dataType === 'json').fileUrl;
        const folderUrl = await handlePdf(images, req.body.testName);
        const test = await db.Reading.create({
            level: req.body.level,
            testName: req.body.testName,
            pdf: images,
            images: folderUrl,
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
        res.status(500).json({ message: 'Failed to create Reading.' });
    }

});

// Get all Readings
router.get('/', async (req, res) => {
    try {
        const Readings = await db.Reading.findAll();
        res.json(Readings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Readings.' });
    }
});

// Get Reading by ID
router.get('/:id/:level', async (req, res) => {
    try {
        console.log(req.params.id);
        const Reading = await db.Reading.findOne({
            where: {
                testName: req.params.id,
                level: req.params.level

            }
        })
        if (!Reading) {
            res.status(404).json({ message: 'Reading not found.' });
        } else {
            res.json(Reading);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Reading.' });
    }
});

// Update Reading by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Reading.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Reading not found.' });
        } else {
            const Reading = await Reading.findByPk(req.params.id);
            res.json(Reading);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Reading.' });
    }
});

// Delete Reading by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Reading.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Reading not found.' });
        } else {
            res.json({ message: 'Reading deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Reading.' });
    }
});

module.exports = router;