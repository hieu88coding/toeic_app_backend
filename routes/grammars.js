const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');
const unzipAndUploadToFirebase = require('../extractPart')
const { Op } = require('sequelize');

// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data);
        console.log(req.body.testName);
        const exel = (data.find(obj => obj.dataType === 'exel') !== undefined) ? data.find(obj => obj.dataType === 'exel').fileUrl : 0;
        const answer = data.find(obj => obj.dataType === 'json').fileUrl;
        const exelFolderUrl = (exel !== 0) ? exel : 'null';
        const test = await db.Grammar.create({
            testName: req.body.testName,
            pdf: (exel !== 0) ? exelFolderUrl : 'null',
            correctAnswer: answer,
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create Grammar.' });
    }

});

// Get all Grammars
router.get('/', async (req, res) => {
    try {
        const Grammars = await db.Grammar.findAll();
        res.json(Grammars);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Grammars.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const Grammar = await db.Grammar.findAll({
            where: {
                partName: req.params.id,
            }
        })
        if (!Grammar) {
            res.status(404).json({ message: 'Grammar not found.' });
        } else {
            res.json(Grammar);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Grammar.' });
    }
});

router.get('/:levelStart/:levelEnd', async (req, res) => {
    try {
        const Grammar = await db.Grammar.findAll({
            where: {
                level: {
                    [Op.between]: [req.params.levelStart, req.params.levelEnd]
                }
            }
        })
        if (!Grammar) {
            res.status(404).json({ message: 'Grammar not found.' });
        } else {
            res.json(Grammar);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Grammar.' });
    }
});

// Get Grammar by ID
router.get('/:id/:testName', async (req, res) => {
    try {
        console.log(req.params.id);
        const Grammar = await db.Grammar.findOne({
            where: {
                testName: req.params.testName,
                partName: req.params.id

            }
        })
        if (!Grammar) {
            res.status(404).json({ message: 'Grammar not found.' });
        } else {
            res.json(Grammar);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Grammar.' });
    }
});

// Update Grammar by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Grammar.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Grammar not found.' });
        } else {
            const Grammar = await Grammar.findByPk(req.params.id);
            res.json(Grammar);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Grammar.' });
    }
});

// Delete Grammar by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Grammar.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Grammar not found.' });
        } else {
            res.json({ message: 'Grammar deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Grammar.' });
    }
});

module.exports = router;