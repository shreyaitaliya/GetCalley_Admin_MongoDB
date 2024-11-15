const { SuperAdmin } = require('../models/superAdminModel');
const jwt = require('jsonwebtoken');

// login SuperAdmin
const Login = async (req, res) => {
    try {
        let user = await SuperAdmin.findOne({ email: req.body.email });
        if (!user || user.password !== req.body.password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are not same"
            });
        }

        let token = await jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "12151515612626s" });
        return res.status(200).send({
            success: true,
            message: "Token is here",
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { Login };