const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    // Check if no auth header
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract token from Bearer scheme
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Invalid token format' });
    }

    // verify token
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ msg: 'Token is not valid' });
            }
            
            req.user = decoded;
            next();
        });
    } catch (err) {
        console.error('Server error in token verification:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
}

module.exports = verifyToken;