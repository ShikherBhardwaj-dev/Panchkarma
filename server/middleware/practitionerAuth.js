const practitionerAuth = async (req, res, next) => {
    // Check if user is a practitioner
    if (req.user.role !== 'practitioner') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Practitioner privileges required.' 
        });
    }
    next();
};

module.exports = practitionerAuth;