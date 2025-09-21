const practitionerAuth = async (req, res, next) => {
    // Support both `userType` (client and JWT payload) and legacy `role`
    const isPractitioner = (req.user && (req.user.userType === 'practitioner' || req.user.role === 'practitioner'));
    if (!isPractitioner) {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Practitioner privileges required.' 
        });
    }
    next();
};

module.exports = practitionerAuth;