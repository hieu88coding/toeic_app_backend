const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (req, res, next) => {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;