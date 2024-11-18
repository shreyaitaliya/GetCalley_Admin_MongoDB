const { FeedbackModel } = require('../models/feedbackModel');
const { FeedbackHistoryModel } = require('../models/feedbackhistoryModel');

const AddFeedback = async (req, res) => {
    try {
        const { heading, description } = req.body;
        const createdBy = req.company.name;

        const AddData = await FeedbackModel.create({ heading, description, createdBy });

        return res.status(200).send({
            success: true,
            message: 'Feedback Added Successfully..',
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

// GetAllData
const GetAllData = async (req, res) => {
    try {
        const GetAllData = await FeedbackModel.find({});
        if (!GetAllData) {
            return res.status(400).send({
                success: false,
                message: 'Feedback Data Can Not Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Feedback All Data Viewed Successfully..',
            Data: GetAllData
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
        const findById = await FeedbackModel.findById(id);
        if (!findById) {
            return res.status(400).send({
                success: false,
                message: 'Feedback Can Not Data Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Feedback Data Found Successfully..',
            Data: findById
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
        const { heading, description } = req.body;
        const FindData = await FeedbackModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Feeback Data Can Not Found..',
            })
        }
        const history = await FeedbackHistoryModel.create({
            excelfileID: FindData._id,
            heading: FindData.heading,
            description: FindData.description,
            status: FindData.status,
            createdBy: FindData.createdBy,
            createdAt: new Date(),
        })

        const update = await FeedbackModel.findByIdAndUpdate(id, { heading, description }, { new: true });

        return res.status(400).send({
            success: true,
            message: 'Feedback Updated Successfully..',
            Data: update
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

// Delete
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const FindData = await FeedbackModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Feedback Data Can Not Found..'
            })
        }
        const history = await FeedbackHistoryModel.create({
            excelfileID: FindData._id,
            heading: FindData.heading,
            description: FindData.description,
            status: FindData.status,
            createdBy: FindData.createdBy,
            createdAt: new Date(),
        })
        const DeleteData = await FeedbackModel.findByIdAndDelete(id);
        return res.status(200).send({
            success: true,
            message: 'Feedback Data Deleted Successfully..'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        })
    }
}

module.exports = ({
    AddFeedback, GetAllData, GetByID, Update, Delete
})