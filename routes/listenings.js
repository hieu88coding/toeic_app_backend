const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');
const unzipAndUploadToFirebase = require('../extractPart')
const { Op } = require('sequelize');

router.get('/count', async (req, res) => {
    try {
        const count = await db.Listening.count();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch count.' });
    }
});

// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const exel = (data.find(obj => obj.dataType === 'exel') !== undefined) ? data.find(obj => obj.dataType === 'exel').fileUrl : 0;
        const images = (data.find(obj => obj.dataType === 'jpg') !== undefined) ? data.find(obj => obj.dataType === 'jpg').fileUrl : 0;
        const audio = data.find(obj => obj.dataType === 'mp3').fileUrl;
        const answer = data.find(obj => obj.dataType === 'json').fileUrl;
        const exelFolderUrl = (exel !== 0) ? exel : 'null';
        const audioFolderUrl = await unzipAndUploadToFirebase('Listenings', audio, 'mp3', req.body.testName, req.body.part);
        const imagesFolderUrl = (images !== 0) ? await unzipAndUploadToFirebase('Listenings', images, 'jpg', req.body.testName, req.body.part) : 'null';
        const test = await db.Listening.create({
            testName: req.body.testName,
            partName: req.body.part,
            level: req.body.level,
            pdf: (exel !== 0) ? exelFolderUrl : 'null',
            images: (images !== 0) ? imagesFolderUrl : 'null',
            audiomp3: audioFolderUrl,
            correctAnswer: answer,
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
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

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const Listening = await db.Listening.findAll({
            where: {
                partName: req.params.id,
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

router.get('/:levelStart/:levelEnd', async (req, res) => {
    try {
        const Listening = await db.Listening.findAll(
            {
                where: {
                    level: {
                        [Op.between]: [req.params.levelStart, req.params.levelEnd]
                    }
                }
            }
        )
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

// Get Listening by ID
router.get('/:id/:testName', async (req, res) => {
    try {
        const Listening = await db.Listening.findOne({
            where: {
                testName: req.params.testName,
                partName: req.params.id
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