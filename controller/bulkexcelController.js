const { ExcelModel } = require('../models/bulkexcelModel');
const ExcelSheetDataModel = require('../models/getExcelSheetModel');
const ExcelSheetDataHistoryModel = require('../models/getExcelSheetHistoryModel');
const XLSX = require('xlsx');
const fs = require('fs');

// Add Bulk
const AddExcelFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload an Excel file." });
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const fileData = {
            excelfile: req.file.filename,
            createdBy: req.company.name,
        };

        // Save the uploaded file info to ExcelModel
        const savedFile = await ExcelModel.create(fileData);

        // Save each row from the Excel sheet data to ExcelSheetDataModel
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
        console.error(error);
        res.status(500).send({ message: "Error uploading file and storing data", error });
    }
};

// Add Manually
const AddManually = async (req, res) => {
    try {
        const { Name, Contact, Notes } = req.body;
        const agentName = req.company.name;

        const AddData = await ExcelSheetDataModel.create({ Name, Contact, Notes, agentName });

        return res.status(200).send({
            success: true,
            message: 'Manually Data Added Successfully..',
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
const GetAllData = async (req, res) => {
    try {
        const FindData = await ExcelSheetDataModel.find({});
        return res.status(200).send({
            success: true,
            message: 'ExcelData Find Successfully',
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

// StartTime
const StartCall = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await ExcelSheetDataModel.findById(id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        if (record.status === 'InProgress') {
            return res.status(400).json({
                success: false,
                message: "Call is already in progress"
            });
        }

        const updatedRecord = await ExcelSheetDataModel.findByIdAndUpdate(
            id,
            {
                status: 'InProgress',
                callStartTime: new Date(),
                callDate: Date.now(),
                duration: null,
                callEndTime: null
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Call started successfully",
            data: updatedRecord
        });
    } catch (error) {
        console.error('Error in startCall:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PauseCall
const PauseCall = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received ID for Pause:", id);

        const record = await ExcelSheetDataModel.findById(id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found."
            });
        }

        if (record.status !== "InProgress") {
            return res.status(400).json({
                success: false,
                message: "Call is not in progress."
            });
        }

        const pauseTime = new Date();
        const durationMs = pauseTime - record.callStartTime;
        const durationMinutes = Math.floor(durationMs / 60000);
        const durationSeconds = Math.floor((durationMs % 60000) / 1000);
        const duration = `${durationMinutes} minutes ${durationSeconds} seconds`;

        const updatedData = await ExcelSheetDataModel.findByIdAndUpdate(
            id,
            {
                status: "Called",
                duration,
                callDate: Date.now(),
                callEndTime: pauseTime,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Call paused, duration recorded.",
            data: updatedData
        });
    } catch (error) {
        console.error('Error in pauseCall:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DND Mode
const DNDMode = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await ExcelSheetDataModel.findByIdAndUpdate(
            id,
            { dnd: true },
            { new: true }
        );
        if (!updatedData) {
            return res.status(400).send({
                success: false,
                message: "Record Not Found.."
            })
        }

        return res.status(200).send({
            success: true,
            message: "DND Mode Is On...",
            Data: updatedData
        })


    } catch (error) {
        console.log(error);
        return res.status(400).send({

        })
    }
}

// Delete Data
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const FindData = await ExcelSheetDataModel.findByIdAndDelete(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'Caller Data Can Not Found..'
            })
        }

        const History = await ExcelSheetDataHistoryModel.create({
            GetexcelDataID: FindData._id,
            excelfileID: FindData.excelfileID,
            Name: FindData.Name,
            Contact: FindData.Contact,
            Notes: FindData.Notes,
            dnd: FindData.dnd,
            status: FindData.status,
            feedback: FindData.feedback,
            callNotes: FindData.callNotes,
            agentNamebackup: FindData.agentName,
            duration: FindData.duration,
            createdAt: new Date(),
        })

        return res.status(200).send({
            success: true,
            message: 'Called Data Deleted Successfully..'
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

// Latest Information
const LatestInfo = async (req, res) => {
    try {
        const FindData = await ExcelSheetDataModel.find({});

        if (!FindData || FindData.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Data Not Found...'
            });
        }

        // Map over the data to structure it properly
        const formattedData = FindData.map(data => ({
            Name: data.Name,
            Contact: data.Contact,
            dnd: data.dnd,
            Notes: data.Notes,
            status: data.status,
            feedback: data.feedback,
            callNotes: data.callNotes,
            callDate: data.callDate
        }));

        return res.status(200).send({
            success: true,
            message: 'Data Viewed Successfully..',
            Data: formattedData
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

// Call History 
const CallHistory = async (req, res) => {
    try {
        const FindData = await ExcelSheetDataModel.find({});

        if (!FindData || FindData.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Data Not Found...'
            });
        }

        // Map over the data to structure it properly
        const formattedData = FindData.map(data => ({
            Contact: data.Contact,
            feedback: data.feedback,
            callNotes: data.callNotes,
            callDate: data.callDate,
            duration: data.duration
        }));

        return res.status(200).send({
            success: true,
            message: 'Data Viewed Successfully..',
            Data: formattedData
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    AddExcelFile, AddManually, GetAllData, StartCall, DNDMode, PauseCall, Delete, LatestInfo, CallHistory
};