import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// AUTHENTICATION MIDD TO CHECK IF USER IS LOGGED IN
export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not Authorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

// ADMIN MIDD TO CHECK ONLY ADMIN ACCESS
export const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};