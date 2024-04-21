const db = require('../models/index.js');
const express = require('express');
const router = express.Router();


// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const test = await db.Vocabulary.create({
            topicName: data.testName,
            number: data.number,
            word: data.word,
            type: data.type,
            transcribe: data.transcribe,
            image: data.image,
            meaning: data.meaning,
        });

        res.json({
            message: 'Upload backend thành công',
            status: 200,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create Vocabulary.' });
    }

});

// Get all Vocabularys
router.get('/', async (req, res) => {
    try {
        const distinctTopicNames = await db.Vocabulary.findAll({
            attributes: ['topicName'], // Chỉ lấy trường testName
            group: ['topicName'], // Nhóm các bản ghi theo trường testName
        });

        const topicNames = distinctTopicNames.map((vocabulary) => vocabulary.topicName);
        res.json(topicNames);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Vocabularys.' });
    }
});

// Get Vocabulary by ID
router.get('/:topicName', async (req, res) => {
    try {
        const Vocabulary = await db.Vocabulary.findAll({
            where: {
                topicName: req.params.topicName
            }
        })
        if (!Vocabulary) {
            res.status(404).json({ message: 'Vocabulary not found.' });
        } else {
            res.json(Vocabulary);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Vocabulary.' });
    }
});

// Update Vocabulary by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Vocabulary.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Vocabulary not found.' });
        } else {
            const Vocabulary = await Vocabulary.findByPk(req.params.id);
            res.json(Vocabulary);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Vocabulary.' });
    }
});

// Delete Vocabulary by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Vocabulary.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Vocabulary not found.' });
        } else {
            res.json({ message: 'Vocabulary deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Vocabulary.' });
    }
});

module.exports = router;