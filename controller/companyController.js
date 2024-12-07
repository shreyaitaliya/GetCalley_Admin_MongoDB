const mongoose = require('mongoose');
const { CompanyModel } = require('../models/CompanyModel');
const { OtpModel } = require('../models/otpModel');
const { CompanyhistoryModel } = require('../models/companyhistoryModel');
const { SubscriptionPlan } = require('../models/subscriptionModel')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

// Add Company
const CompanyAdd = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const createdBy = req.user.email;

        // const subscription = await SubscriptionPlan.findOne({ role });
        // if (!subscription) {
        //     throw new Error(`Invalid role. Role ${role} does not exist in SubscriptionPlan.`);
        // }
        let imagename = '';
        if (req.file) {
            imagename = req.file.path;
        }

        const AddData = await CompanyModel.create({ name, email, password, phone, role, image: imagename, createdBy });

        return res.status(200).send({
            success: true,
            message: 'Company Added Successfully...',
            Data: AddData
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

// GetByAllData
const GetByAllData = async (req, res) => {
    try {
        const FindData = await CompanyModel.find({});
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Company Data Can Not Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Company Data Found Successfully..',
            Data: FindData
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

// GetByID
const GetByID = async (req, res) => {
    try {
        const id = req.params.id;
        const FindData = await CompanyModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Company Agent Can Not Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Company Agent Find Successfully..',
            Data: FindData
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

// Update
const Update = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, password, phone } = req.body;

        const FindData = await CompanyModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Company Agent Can Not Found..'
            })
        }

        // Create history with the companyID
        const history = await CompanyhistoryModel.create({
            companyID: FindData._id,
            name: FindData.name,
            email: FindData.email,
            password: FindData.password,
            phone: FindData.phone,
            role: FindData.role,
            BackupCreatedBy: FindData.createdBy,
            BackupCreatedOn: new Date(),
        });

        // Update the company record
        const update = await CompanyModel.findByIdAndUpdate(id, { name, email, password, phone }, { new: true });

        return res.status(200).send({
            success: true,
            message: 'Company Agent Updated Successfully..',
            Data: update
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

// Login
const Login = async (req, res) => {
    try {
        let company = await CompanyModel.findOne({ email: req.body.email });
        if (!company || company.password !== req.body.password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are not same"
            });
        }

        let token = await jwt.sign({ company }, process.env.JWT_SECRET, { expiresIn: "12151515612626s" });
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

// ForgetPassword
const ForgetPassword = async (req, res) => {
    try {
        // Check if the email exists in the database
        const email = req.body.email;
        const company = await CompanyModel.findOne({ email });
        if (!company) {
            return res.status(404).send({
                success: false,
                message: 'Company User Not Found.',
            });
        }

        // Generate OTP
        const otp = await OtpModel.create({ otp: Math.floor(100000 + Math.random() * 900000), email })

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Your OTP',
            html: `<h3>Your OTP: <strong>${otp}</strong></h3>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Send response
        return res.status(200).send({
            success: true,
            message: 'OTP sent successfully.',
            otp
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while sending the OTP. Please try again later.',
        });
    }
};

// Change Password
const ChangePassword = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { email, otp, newpassword } = req.body;

        // Validate email, otp, and new password
        if (!email || !otp || !newpassword) {
            return res.status(400).send({
                success: false,
                message: 'Email, OTP, and new password are required.',
            });
        }

        if (newpassword.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'Password must be at least 6 characters long.',
            });
        }

        // Find the OTP entry
        const otpRecord = await OtpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).send({
                success: false,
                message: 'Invalid OTP or email.',
            });
        }

        // Find the company user
        const company = await CompanyModel.findOne({ email });
        if (!company) {
            return res.status(404).send({
                success: false,
                message: 'Company user not found.',
            });
        }

        // Update the password
        company.password = newpassword;
        await company.save();

        // Remove the OTP after successful password update
        await OtpModel.deleteOne({ email, otp });

        return res.status(200).send({
            success: true,
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while changing the password.',
        });
    }
};

// Genral Setting
const GenralSetting = async (req, res) => {
    try {
        // Check if the user's role is 1
        if (req.company.role !== 1) {
            return res.status(403).send({
                success: false,
                message: 'Forbidden: You do not have permission to perform this action.'
            });
        }

        const id = req.params.id;
        const { name, phone } = req.body;

        // Find the company by ID
        const FindData = await CompanyModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Company Agent Not Found.'
            });
        }

        // Update the company data
        const update = await CompanyModel.findByIdAndUpdate(id, { name, image: req.file.path, phone }, { new: true });

        return res.status(200).send({
            success: true,
            message: 'Setting Updated Successfully.',
            Data: update
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    CompanyAdd, GetByAllData, GetByID, Update, Login, GenralSetting, ForgetPassword, ChangePassword
};
