const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const handlePdf = require('../pdfImages');
const unzipAndUploadToFirebase = require('../extractPart')
const { Op } = require('sequelize');

router.get('/count', async (req, res) => {
    try {
        const count = await db.Blog.count();
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
        const exel = (data.find(obj => obj.dataType === 'html') !== undefined) ? data.find(obj => obj.dataType === 'html').fileUrl : 0;
        const image = data.find(obj => obj.dataType === 'jpg').fileUrl;
        const exelFolderUrl = (exel !== 0) ? exel : 'null';
        const test = await db.Blog.create({
            title: req.body.blogName,
            blogImage: image,
            contentHTML: (exel !== 0) ? exelFolderUrl : 'null',
            contentMarkdown: req.body.category,
            description: req.body.description
        });

        res.json({
            message: 'Lưu đề vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create Blog.' });
    }

});

// Get all Blogs
router.get('/', async (req, res) => {
    try {
        const Blogs = await db.Blog.findAll();
        res.json(Blogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Blogs.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const Blog = await db.Blog.findAll({
            where: {
                id: req.params.id,
            }
        })
        if (!Blog) {
            res.status(404).json({ message: 'Blog not found.' });
        } else {
            res.json(Blog);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Blog.' });
    }
});
router.get('/:category', async (req, res) => {
    try {
        const Blog = await db.Blog.findAll({
            where: {
                contentMarkdown: req.params.category,
            }
        })
        if (!Blog) {
            res.status(404).json({ message: 'Blog not found.' });
        } else {
            res.json(Blog);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Blog.' });
    }
});

// Get Blog by ID
router.get('/:id/:testName', async (req, res) => {
    try {
        console.log(req.params.id);
        const Blog = await db.Blog.findOne({
            where: {
                testName: req.params.testName,
                partName: req.params.id

            }
        })
        if (!Blog) {
            res.status(404).json({ message: 'Blog not found.' });
        } else {
            res.json(Blog);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch Blog.' });
    }
});

// Update Blog by ID
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount] = await db.Blog.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Blog not found.' });
        } else {
            const Blog = await Blog.findByPk(req.params.id);
            res.json(Blog);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Blog.' });
    }
});

// Delete Blog by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowsCount = await db.Blog.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Blog not found.' });
        } else {
            res.json({ message: 'Blog deleted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Blog.' });
    }
});

module.exports = router;