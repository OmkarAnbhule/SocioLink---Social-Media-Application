require('dotenv').config();
const jwt = require('jsonwebtoken')


exports.auth = (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' })
    }
    const { user, email } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (req.body.id) {
        req.body.id = user;
    }
    else {
        req.params.id = user;
    }
    next();
}