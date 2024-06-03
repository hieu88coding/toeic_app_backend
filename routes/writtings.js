const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const unzipAndUploadToFirebase = require('../extractPart')
const { Op } = require('sequelize');

// Create a new test
router.post('/', async (req, res) => {
    try {
        const data = req.body.data;
        const test = await db.Writting.create({
            testName: req.body.testName,
            partName: req.body.part,
            pdf: req.body.pdf,
            images: req.body.images,
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create Writting.' });
    }

});

// Get all Writtings
router.get('/', async (req, res) => {
    try {
        const Writtings = await db.Writting.findAll();
        res.json(Writtings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Writtings.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const Writting = await db.Writting.findAll({
            where: {
                partName: req.params.id,
            }
        })
        if (!Writting) {
            res.status(404).json({ message: 'Writting not found.' });
        } else {
            res.json(Writting);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Writting.' });
    }
});

router.get('/:levelStart/:levelEnd', async (req, res) => {
    try {
        const Writting = await db.Writting.findAll(
            {
                where: {
                    level: {
                        [Op.between]: [req.params.levelStart, req.params.levelEnd]
                    }
                }
            }
        )
        if (!Writting) {
            res.status(404).json({ message: 'Writting not found.' });
        } else {
            res.json(Writting);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Writting.' });
    }
});

// Get Writting by ID
router.get('/:id/:testName', async (req, res) => {
    try {
        const Writting = await db.Writting.findOne({
            where: {
                testName: req.params.testName,
                partName: req.params.id
            }
        })
        if (!Writting) {
            res.status(404).json({ message: 'Writting not found.' });
        } else {
            res.json(Writting);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Writting.' });
    }
});

// Update Writting by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Writting.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Writting not found.' });
        } else {
            const Writting = await Writting.findByPk(req.params.id);
            res.json(Writting);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Writting.' });
    }
});

// Delete Writting by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Writting.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Writting not found.' });
        } else {
            res.json({ message: 'Writting deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Writting.' });
    }
});

module.exports = router;