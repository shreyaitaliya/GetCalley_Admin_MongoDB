const { AgentModel } = require('../models/AgentModel');
const { AgentHistoryModel } = require('../models/agenthistoryModel');

const AddAgent = async (req, res) => {
    try {
        if (req.company.role !== 3) {
            return res.status(403).send({
                success: false,
                message: 'You do not have the required permissions to add an agent.',
            });
        }

        const { name, mobilenumber, email, password } = req.body;
        const createdBy = req.company.name;

        const currentAgentCount = await AgentModel.countDocuments();

        if (currentAgentCount >= 5) {
            return res.status(400).send({
                success: false,
                message: 'You cannot add more than 5 agents.',
            });
        }

        const AddData = await AgentModel.create({ name, mobilenumber, email, password, createdBy });

        return res.status(400).send({
            success: true,
            message: 'Agent Added Successfully..',
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
        const FindData = await AgentModel.find({});
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Agent Data Can Not Found..'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Agent Data Found Successfully..',
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
        const FindData = await AgentModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Agent Data Can Not Found..'
            })
        }
        return res.status(200).send({
            success: false,
            message: 'Agent Data Found Successfully..',
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
        const { name, mobilenumber, email, password } = req.body;

        const FindData = await AgentModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Agent Data Can Not Found..'
            })
        }

        const History = await AgentHistoryModel.create({
            agentID: FindData._id,
            name: FindData.name,
            mobilenumber: FindData.mobilenumber,
            email: FindData.email,
            password: FindData.password,
            createdBy: FindData.createdBy,
            createdAt: new Date(),
        })

        const update = await AgentModel.findByIdAndUpdate(id, { name, mobilenumber, email, password }, { new: true });

        return res.status(200).send({
            success: true,
            message: 'Agent Updated Sucessfully..',
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
        const FindData = await AgentModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Agent Data Can Not Found..'
            })
        }
        const History = await AgentHistoryModel.create({
            agentID: FindData._id,
            name: FindData.name,
            mobilenumber: FindData.mobilenumber,
            email: FindData.email,
            password: FindData.password,
            createdBy: FindData.createdBy,
            createdAt: new Date(),
        })

        const Delete = await AgentModel.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: 'Agent Deleted Successfully..'
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
    AddAgent, GetByAllData, GetByID, Update, Delete
})