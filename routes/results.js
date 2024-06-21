const db = require('../models/index.js');
const express = require('express');
const partresult = require('../models/partresult.js');
const router = express.Router();
const { sequelize, Sequelize, Op } = require('sequelize');
const partNamesArray = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part71', 'part72', 'part73'];
const lisArray = ['part1', 'part2', 'part3', 'part4'];
const reaArray = ['part5', 'part6', 'part71', 'part72', 'part73'];

const dotenv = require('dotenv');
dotenv.config()
const jwt = require('jsonwebtoken');

// Middleware để xác thực token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const tokenWithoutBearer = token.split(' ')[1];
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};
router.get('/count/:type', async (req, res) => {
    try {
        let result = [];
        if (req.params.type === 'Listenings') {
            result = await db.PartResult.findOne({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score > 495 THEN 1 END')), 'highScoreCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score >= 200 AND score <= 495 THEN 1 END')), 'averageScoreCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score < 200 THEN 1 END')), 'lowScoreCount']
                ],

                where: {
                    partName: {
                        [Op.in]: lisArray
                    }
                },
                raw: true
            });
        } else if (req.params.type === 'Readings') {
            result = await db.PartResult.findOne({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score > 495 THEN 1 END')), 'highScoreCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score >= 200 AND score <= 495 THEN 1 END')), 'averageScoreCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score < 200 THEN 1 END')), 'lowScoreCount']
                ],
                where: {
                    partName: {
                        [Op.in]: reaArray
                    }
                },
                raw: true
            });
        } else {
            result = await db.MockResult.findOne({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score > 800 THEN 1 END')), 'highScoreCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score >= 500 AND score <= 800 THEN 1 END')), 'averageScoreCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN score < 500 THEN 1 END')), 'lowScoreCount']
                ],
                where: {},
                raw: true
            });
        }


        const { highScoreCount, averageScoreCount, lowScoreCount, } = result;

        res.json({ highScoreCount, averageScoreCount, lowScoreCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch statistics.' });
    }
});
router.get('/stats/:type', async (req, res) => {
    try {
        let maxScoreResult = null;
        let minScoreResult = null;
        let maxScoreUser = null;
        let minScoreUser = null;
        let averageScoreResult = null
        if (req.params.type === 'Listenings') {
            averageScoreResult = await db.PartResult.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('score')), 'avgScore']
                ],
                where: {
                    partName: {
                        [Op.in]: lisArray
                    }
                },
                raw: true
            });
            maxScoreResult = await db.PartResult.findOne({
                attributes: ['userId', 'score'],
                where: {
                    partName: {
                        [Op.in]: lisArray
                    }
                },
                order: [[Sequelize.col('score'), 'DESC']],
                raw: true
            });

            // Tìm bản ghi có điểm thấp nhất
            minScoreResult = await db.PartResult.findOne({
                attributes: ['userId', 'score'],
                where: {
                    partName: {
                        [Op.in]: lisArray
                    }
                },
                order: [[Sequelize.col('score'), 'ASC']],
                raw: true
            });

            // Lấy thông tin User cho điểm cao nhất

            if (maxScoreResult) {
                maxScoreUser = await db.User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {
                        id: maxScoreResult.userId
                    },
                    raw: true
                });
            }

            // Lấy thông tin User cho điểm thấp nhất
            if (minScoreResult) {
                minScoreUser = await db.User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {
                        id: minScoreResult.userId
                    },
                    raw: true
                });
            }

        } else if (req.params.type === 'Readings') {
            averageScoreResult = await db.PartResult.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('score')), 'avgScore']
                ],
                where: {
                    partName: {
                        [Op.in]: reaArray
                    }
                },
                raw: true
            });
            maxScoreResult = await db.PartResult.findOne({
                attributes: ['userId', 'score'],
                where: {
                    partName: {
                        [Op.in]: reaArray
                    }
                },
                order: [[Sequelize.col('score'), 'DESC']],
                raw: true
            });

            // Tìm bản ghi có điểm thấp nhất
            minScoreResult = await db.PartResult.findOne({
                attributes: ['userId', 'score'],
                where: {
                    partName: {
                        [Op.in]: reaArray
                    }
                },
                order: [[Sequelize.col('score'), 'ASC']],
                raw: true
            });

            // Lấy thông tin User cho điểm cao nhất

            if (maxScoreResult) {
                maxScoreUser = await db.User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {
                        id: maxScoreResult.userId
                    },
                    raw: true
                });
            }

            // Lấy thông tin User cho điểm thấp nhất
            if (minScoreResult) {
                minScoreUser = await db.User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {
                        id: minScoreResult.userId
                    },
                    raw: true
                });
            }

        } else {
            averageScoreResult = await db.MockResult.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('score')), 'avgScore']
                ],
                raw: true
            });
            maxScoreResult = await db.MockResult.findOne({
                attributes: ['userId', 'score'],
                order: [[Sequelize.col('score'), 'DESC']],
                raw: true
            });

            // Tìm bản ghi có điểm thấp nhất
            minScoreResult = await db.MockResult.findOne({
                attributes: ['userId', 'score'],
                order: [[Sequelize.col('score'), 'ASC']],
                raw: true
            });

            // Lấy thông tin User cho điểm cao nhất

            if (maxScoreResult) {
                maxScoreUser = await db.User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {
                        id: maxScoreResult.userId
                    },
                    raw: true
                });
            }

            // Lấy thông tin User cho điểm thấp nhất
            if (minScoreResult) {
                minScoreUser = await db.User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {
                        id: minScoreResult.userId
                    },
                    raw: true
                });
            }

        }


        const result = {
            maxScore: {
                score: maxScoreResult ? maxScoreResult.score : null,
                user: maxScoreUser
            },
            minScore: {
                score: minScoreResult ? minScoreResult.score : null,
                user: minScoreUser
            },
            avgScore: averageScoreResult
        };
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch statistics.' });
    }
});

router.get('/user/:type', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        let startMonth, endMonth;

        if (req.params.type === 'first') {
            // 6 tháng đầu năm
            startMonth = 0; // Tháng 1 (tháng 0 theo JS)
            endMonth = 5; // Tháng 6 (tháng 5 theo JS)
        } else if (req.params.type === 'last') {
            // 6 tháng cuối năm
            startMonth = 6; // Tháng 7 (tháng 6 theo JS)
            endMonth = 11; // Tháng 12 (tháng 11 theo JS)
        } else {
            return res.status(400).json({ message: 'Invalid period parameter. Use "first" or "last".' });
        }

        const results = await db.User.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'userCount']
            ],
            where: {
                createdAt: {
                    [Op.between]: [
                        new Date(currentYear, startMonth, 1),
                        new Date(currentYear, endMonth + 1, 0, 23, 59, 59) // ngày cuối của tháng endMonth
                    ]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        // Khởi tạo mảng kết quả cho tất cả các tháng với giá trị mặc định là 0
        const monthCount = (endMonth - startMonth) + 1;
        const monthlyResults = Array.from({ length: monthCount }, (_, i) => ({
            month: startMonth + i + 1, // Tháng bắt đầu từ 1 (tháng 1)
            userCount: 0
        }));

        // Cập nhật mảng kết quả với dữ liệu thực tế từ truy vấn
        results.forEach(result => {
            const monthIndex = result.month - startMonth - 1;
            if (monthIndex >= 0 && monthIndex < monthCount) {
                monthlyResults[monthIndex].userCount = parseInt(result.userCount, 10);
            }
        });

        res.json(monthlyResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch results.' });
    }
});
// Create a new test
router.post('/', async (req, res) => {
    try {
        const test = await db.PartResult.create({
            userId: req.body.userId,
            testName: req.body.testName,
            partName: req.body.partName,
            userAnswer: req.body.userAnswer,
            score: req.body.score
        });

        res.json({
            message: 'Lưu lịch sử bài làm vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create PartResult.' });
    }

});

// Get all PartResults
router.get('/', async (req, res) => {
    try {
        const PartResults = await db.PartResult.findAll();
        res.json(PartResults);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch PartResults.' });
    }
});

// Get PartResult by ID
router.get('/latest', async (req, res) => {
    try {
        const PartResult = await db.PartResult.findOne({
            order: [['createdAt', 'DESC']],
        });
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.get('/highestPart', authenticateToken, async (req, res) => {
    try {
        console.log(req.user);
        const PartResult = await db.PartResult.findAll({
            where: {
                partName: partNamesArray,
                userId: req.user.id
            },
            order: [['score', 'DESC']],
            group: ['partName'],
        });
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.get('/:id/:userId', async (req, res) => {
    try {
        const PartResult = await db.PartResult.findOne({
            where: {
                id: req.params.id,
                userId: req.params.userId
            }
        })
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.post('/mocks', async (req, res) => {
    try {
        const test = await db.MockResult.create({
            userId: req.body.userId,
            testName: req.body.testName,
            userAnswer: req.body.userAnswer,
            score: req.body.score
        });

        res.json({
            message: 'Lưu lịch sử bài làm vào DB thành công',
            status: 200,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create PartResult.' });
    }

});

// Get all PartResults
router.get('/mocks', async (req, res) => {
    try {
        const PartResults = await db.MockResult.findAll();
        res.json(PartResults);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch PartResults.' });
    }
});

// Get PartResult by ID
router.get('/mocksLatest', async (req, res) => {
    try {
        const MockResult = await db.MockResult.findOne({
            order: [['createdAt', 'DESC']],
        });
        console.log(MockResult);
        if (!MockResult) {
            res.status(404).json({ message: 'MockResult not found.' });
        } else {
            res.json(MockResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});

router.get('/mocks/:id/:userId', async (req, res) => {
    try {
        const PartResult = await db.MockResult.findOne({
            where: {
                id: req.params.id,
                userId: req.params.userId
            }
        })
        if (!PartResult) {
            res.status(404).json({ message: 'PartResult not found.' });
        } else {
            res.json(PartResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch PartResult.' });
    }
});



module.exports = router;