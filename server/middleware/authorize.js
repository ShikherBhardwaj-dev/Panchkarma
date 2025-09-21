const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.userType)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

        next();
    };
};

export default authorize;