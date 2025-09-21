import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const config = JSON.parse(readFileSync(join(dirname(__dirname), 'config', 'default.json')));

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
        
        // Add user from payload
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ 
            success: false, 
            message: 'Token is not valid' 
        });
    }
};

export default auth;