const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
const { raw } = require('mysql2');
const db = require('../models/index.js');
dotenv.config()
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function configGoogle() {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_KEY,
        callbackURL: process.env.GOOGLE_APP_CLIENT_REDIRECT,
    },
        async function (accessToken, refreshToken, profile, cb) {
            const typeAcc = 'GOOGLE'
            let dataRaw = {
                familyName: profile.name.familyName,
                givenName: profile.name.givenName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                photos: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ""
            }
            let user = null;
            let token = null;
            try {
                user = await db.User.findOne({
                    where: {
                        email: dataRaw.email,
                        type: typeAcc
                    },
                    raw: true
                })
                if (!user) {
                    user = await db.User.create({
                        firstName: dataRaw.givenName,
                        lastName: dataRaw.familyName,
                        type: typeAcc,
                        email: dataRaw.email,
                        picture: dataRaw.photos,
                        role: 0
                    })
                    user = user.get({ plain: true })


                }
                // const expiresIn = 3600; // Thời gian hết hạn của JWT (trong giây)

                // token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn });
                // console.log(token);
            } catch (error) {
                console.log(error);
            }
            // user.code = uuidv4();
            return cb(null, user);

        }
    ));
}

module.exports = { configGoogle, authenticateToken };
