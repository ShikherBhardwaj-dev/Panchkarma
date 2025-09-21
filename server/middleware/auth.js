const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

const auth = async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token, authorization denied' 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Add user from payload (handle both nested and direct user structure)
        req.user = decoded.user || decoded;
        next();
    } catch (err) {
        res.status(401).json({ 
            success: false, 
            message: 'Token is not valid' 
        });
    }
};

module.exports = auth;