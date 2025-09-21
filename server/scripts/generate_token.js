const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

const token = jwt.sign(
    { 
        user: {
            _id: '68cef4c8d4d345c6c404a2d0',
            name: 'Dr Test 2',
            email: 'dr.test2@example.com',
            userType: 'practitioner'
        }
    },
    config.jwtSecret,
    { expiresIn: '24h' }
);

console.log('Token:', token);