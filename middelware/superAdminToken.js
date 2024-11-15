const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({
            success: false,
            message: 'Token is missing'
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'Token is missing'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).send({
                success: false,
                message: 'Token is not valid',
            });
        }

        req.user = decoded.user;

        next();
    });
};

module.exports = authenticateToken;
