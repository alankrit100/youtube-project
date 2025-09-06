const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            //attach decoded user to request object
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: `User role '${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };