const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const unzipAndUploadToFirebase = require('../extractPart')
const { Op } = require('sequelize');

// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const audio = (data.find(obj => obj.dataType === 'mp3') !== undefined) ? data.find(obj => obj.dataType === 'mp3').fileUrl : 0;
        const images = (data.find(obj => obj.dataType === 'jpg') !== undefined) ? data.find(obj => obj.dataType === 'jpg').fileUrl : 0;
        const test = await db.Speaking.create({
            testName: req.body.testName,
            partName: req.body.part,
            pdf: req.body.pdf,
            images: (images !== 0) ? images : 'null',
            audiomp3: (audio !== 0) ? audio : 'null'
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create Speaking.' });
    }

});

// Get all Speakings
router.get('/', async (req, res) => {
    try {
        const Speakings = await db.Speaking.findAll();
        res.json(Speakings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Speakings.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const Speaking = await db.Speaking.findAll({
            where: {
                partName: req.params.id,
            }
        })
        if (!Speaking) {
            res.status(404).json({ message: 'Speaking not found.' });
        } else {
            res.json(Speaking);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Speaking.' });
    }
});

router.get('/:levelStart/:levelEnd', async (req, res) => {
    try {
        const Speaking = await db.Speaking.findAll(
            {
                where: {
                    level: {
                        [Op.between]: [req.params.levelStart, req.params.levelEnd]
                    }
                }
            }
        )
        if (!Speaking) {
            res.status(404).json({ message: 'Speaking not found.' });
        } else {
            res.json(Speaking);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Speaking.' });
    }
});

// Get Speaking by ID
router.get('/:id/:testName', async (req, res) => {
    try {
        const Speaking = await db.Speaking.findOne({
            where: {
                testName: req.params.testName,
                partName: req.params.id
            }
        })
        if (!Speaking) {
            res.status(404).json({ message: 'Speaking not found.' });
        } else {
            res.json(Speaking);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Speaking.' });
    }
});

// Update Speaking by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Speaking.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Speaking not found.' });
        } else {
            const Speaking = await Speaking.findByPk(req.params.id);
            res.json(Speaking);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Speaking.' });
    }
});

// Delete Speaking by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Speaking.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Speaking not found.' });
        } else {
            res.json({ message: 'Speaking deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Speaking.' });
    }
});

module.exports = router;