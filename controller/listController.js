const { ListModel } = require('../models/ListModel');
const { AgentModel } = require('../models/AgentModel');
const ExcelSheetDataModel = require('../models/getExcelSheetModel');
const ExcelSheetDataHistoryModel = require('../models/getExcelSheetHistoryModel');
const XLSX = require('xlsx');
const fs = require('fs');

const AddList = async (req, res) => {
    try {
        if (req.company.role === 1) {
            const existingLists = await ListModel.countDocuments({ createdBy: req.company.name });
            if (existingLists >= 1) {
                return res.status(403).send({ message: "You can upload only 1 list." });
            }
        }

        // Role 3: Allow agents to upload lists
        if (req.company.role === 3) {
            if (!req.body.agentname) {
                return res.status(400).send({ message: "Please provide an agent name." });
            }

            const agent = await AgentModel.findOne({ name: req.body.agentname });
            if (!agent) {
                return res.status(404).send({ message: "Agent not found." });
            }
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Prepare data for saving
        const fileData = {
            listname: req.body.listname,
            excelfile: req.file.filename,
            createdBy: req.company.name,
        };

        if (req.company.role === 3) {
            const agent = await AgentModel.findOne({ name: req.body.agentname });
            if (agent) {
                fileData.agentname = agent._id;
            }
        }

        const savedFile = await ListModel.create(fileData);

        await Promise.all(sheetData.map(async (row) => {
            await ExcelSheetDataModel.create({
                Name: row.Name,
                Contact: row.Contact,
                Notes: row.Notes,
                excelfileID: savedFile._id,
                agentName: req.company.name,
            });
        }));

        res.status(201).send({
            message: "File uploaded and data stored successfully",
            data: savedFile,
            sheetData: sheetData,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

const GetByID = async (req, res) => {
    try {
        const FindData = await ListModel.find();

        // Check if data exists
        if (!FindData || FindData.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'List Data Cannot Be Found..'
            });
        }

        // Fetch list-wise record counts
        const listDetails = await Promise.all(
            FindData.map(async (data) => {
                const recordCount = await ExcelSheetDataModel.countDocuments({ listId: data._id });
                return {
                    listname: data.listname,
                    createdOn: data.createdOn,
                    recordCount: recordCount,
                };
            })
        );

        // Send response
        return res.status(200).send({
            success: true,
            message: 'List Data Viewed Successfully..',
            lists: listDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = ({
    AddList, GetByID
})