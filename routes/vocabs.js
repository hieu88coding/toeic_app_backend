const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const unzipAndUploadToFirebase = require('../extractPart')

// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const exel = (data.find(obj => obj.dataType === 'exel') !== undefined) ? data.find(obj => obj.dataType === 'exel').fileUrl : 0;
        const images = (data.find(obj => obj.dataType === 'jpg') !== undefined) ? data.find(obj => obj.dataType === 'jpg').fileUrl : 0;
        const imagesFolderUrl = (images !== 0) ? await unzipAndUploadToFirebase('Vocabularys', images, 'jpg', req.body.testName, 'Ảnh') : 'null';
        const exelFolderUrl = (exel !== 0) ? exel : 'null';
        const test = await db.Vocabulary.create({
            topicName: req.body.testName,
            exel: (exel !== 0) ? exelFolderUrl : 'null',
            image: (images !== 0) ? imagesFolderUrl : 'null',
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
        const topicNames = await db.Vocabulary.findAll();

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