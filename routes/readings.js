const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');
const unzipAndUploadToFirebase = require('../extractPart')
const { Op } = require('sequelize');

router.get('/count', async (req, res) => {
    try {
        const count = await db.Reading.count();
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
        console.log(data);
        console.log(req.body.testName);
        const exel = (data.find(obj => obj.dataType === 'exel') !== undefined) ? data.find(obj => obj.dataType === 'exel').fileUrl : 0;
        const answer = data.find(obj => obj.dataType === 'json').fileUrl;
        const exelFolderUrl = (exel !== 0) ? exel : 'null';
        const test = await db.Reading.create({
            testName: req.body.testName,
            partName: req.body.part,
            level: req.body.level,
            pdf: (exel !== 0) ? exelFolderUrl : 'null',
            correctAnswer: answer,
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
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

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const Reading = await db.Reading.findAll({
            where: {
                partName: req.params.id,
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

router.get('/:levelStart/:levelEnd', async (req, res) => {
    try {
        const Reading = await db.Reading.findAll({
            where: {
                level: {
                    [Op.between]: [req.params.levelStart, req.params.levelEnd]
                }
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

// Get Reading by ID
router.get('/:id/:testName', async (req, res) => {
    try {
        console.log(req.params.id);
        const Reading = await db.Reading.findOne({
            where: {
                testName: req.params.testName,
                partName: req.params.id

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