const { CompanyModel } = require('../models/CompanyModel');
const { CompanyhistoryModel } = require('../models/companyhistoryModel');
const { SubscriptionPlan } = require('../models/subscriptionModel')
const jwt = require('jsonwebtoken')

// Add Company
const CompanyAdd = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const createdBy = req.user.email;

        const subscription = await SubscriptionPlan.findOne({ role });
        if (!subscription) {
            throw new Error(`Invalid role. Role ${role} does not exist in SubscriptionPlan.`);
        }

        const AddData = await CompanyModel.create({ name, email, password, phone, role, createdBy });

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

module.exports = {
    CompanyAdd, GetByID, Update, Login
};
