const { SMSModel } = require('../models/SMSModel');
const { SMSHistoryModel } = require('../models/SMSHistoryModel')

const AddSms = async (req, res) => {
    try {
        const { heading, description } = req.body;
        const createdBy = req.company.name;

        const AddData = await SMSModel.create({ heading, description, createdBy });

        return res.status(200).send({
            success: true,
            message: 'SMS Added Successfully..',
            Data: AddData
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

// GetByAllData 
const GetByAllData = async (req, res) => {
    try {
        const FindData = await SMSModel.find({})
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Sms Data Can Not Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'SMS Data Found Succesfully...',
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
        const { id } = req.params;
        const FindData = await SMSModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Sms Data Can Not Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'SMS Data Found Succesfully...',
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
        const { id } = req.params;
        const FindData = await SMSModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Sms Data Not Found..',
            })
        }
        const history = await SMSHistoryModel.create({
            excelfileID: FindData._id,
            heading: FindData.heading,
            description: FindData.description,
            status: FindData.status,
            createdBy: FindData.createdBy,
            createdAt: new Date(),
        })
        const update = await SMSModel.findByIdAndUpdate(id);

        return res.status(200).send({
            success: true,
            message: 'Sms Data Updated Successfully..'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: true,
            message: error.message
        })
    }
}

// Delete
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const FindData = await SMSModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'SMS Data Can Not Found..'
            })
        }
        const history = await SMSHistoryModel.create({
            excelfileID: FindData._id,
            heading: FindData.heading,
            description: FindData.description,
            status: FindData.status,
            createdBy: FindData.createdBy,
            createdAt: new Date(),
        })
        const update = await SMSModel.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: 'SMS Data Deleted Successfully..'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = ({
    AddSms, GetByAllData, GetByID, Update, Delete
})