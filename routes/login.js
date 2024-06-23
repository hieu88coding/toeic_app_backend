const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const { authenticateToken } = require('../controller/googleController.js')
// Đăng ký route cho đăng nhập bằng Facebook và Google
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
    '/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        console.log(req.user);
        const user = req.user;
        const token = jwt.sign(user, process.env.JWT_SECRET);
        res.cookie('x-auth-token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, domain: '.netlify.app', sameSite: 'none' });
        //res.redirect(`http://localhost:5173/`);
        res.render('social.ejs', { ssoToken: token })
    }
);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/redirect',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log(req.user);
        const user = req.user;
        const token = jwt.sign(user, process.env.JWT_SECRET);
        res.cookie('x-auth-token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, domain: '.netlify.app', sameSite: 'none' });
        //res.redirect(`http://localhost:5173/`);
        res.render('social.ejs', { ssoToken: token })
    }
);

// Route bảo vệ yêu cầu từ người dùng đã xác thực
router.get('/profile', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({ user });
});




module.exports = router;