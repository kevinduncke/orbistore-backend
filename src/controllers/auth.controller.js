import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// FUNTION TO GENERATE JWT TOKEN RING
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// REGISTER NEW USER AND GENERATE JWT TOKEN
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const userChech = await User.findOne({ email });
        if (userChech) {
            return res.status(400).json({
                message: 'Email already in use'
            });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// LOGIN USER AND GENERATE JWT TOKEN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });;

        res.json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGOUT USER BY CLEARING TOKEN COOKIE
export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

// GET CURRENT USER INFO
export const me = async (req, res) => {
    res.json({ user: req.user });
};