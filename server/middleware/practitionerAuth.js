const practitionerAuth = async (req, res, next) => {
    // Support both `userType` (client and JWT payload) and legacy `role`
    console.log('[DEBUG] Practitioner auth check:', {
        user: req.user,
        userType: req.user?.userType,
        role: req.user?.role
    });

    const isPractitioner = (req.user && (req.user.userType === 'practitioner' || req.user.role === 'practitioner'));
    if (!isPractitioner) {
        console.log('[DEBUG] Practitioner auth failed:', {
            user: req.user,
            userType: req.user?.userType,
            role: req.user?.role
        });
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Practitioner privileges required.' 
        });
    }
    next();
};

export default practitionerAuth;