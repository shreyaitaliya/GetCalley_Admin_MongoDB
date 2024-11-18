const { ExcelModel } = require('../models/bulkexcelModel');
const ExcelSheetDataModel = require('../models/getExcelSheetModel');
const ExcelSheetDataHistoryModel = require('../models/getExcelSheetHistoryModel');
const XLSX = require('xlsx');
const fs = require('fs');
const { error } = require('console');

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
            listId: req.body.listId,
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
                listId: savedFile.listId,
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
        const { Name, Contact, Notes, listId } = req.body;
        const agentName = req.company.name;

        const AddData = await ExcelSheetDataModel.create({ Name, Contact, Notes, listId, agentName });

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
        const record = await ExcelSheetDataModel.findOne({ status: 'Pending' }).sort({ _id: 1 });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "No pending calls found"
            });
        }

        if (record.dnd) {
            return res.status(403).json({
                success: false,
                message: "Cannot start call: DND mode is enabled for this contact"
            });
        }

        const updatedRecord = await ExcelSheetDataModel.findByIdAndUpdate(
            record._id,
            {
                status: 'InProgress',
                callStartTime: new Date(),
                callDate: Date.now(), // Current date
                duration: null, // Reset duration
                callEndTime: null // Reset end time
            },
            { new: true } // Return the updated document
        );

        return res.status(200).json({
            success: true,
            message: "Call started successfully",
            data: updatedRecord
        });
    } catch (error) {
        console.error('Error in StartCall:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while starting the call"
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
            duration: data.duration,
            reschedualDate: data.reschedualDate
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

// Reschedual Time
const Reschedual = async (req, res) => {
    try {
        const { id } = req.params;
        const { reschedualDate, reschedualTime, callNotes } = req.body;

        // Validate the reschedualTime to ensure it's in HH:mm:ss format
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
        if (!timeRegex.test(reschedualTime)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid time format. Please use HH:mm:ss format.'
            });
        }

        const FindData = await ExcelSheetDataModel.findById(id);
        if (!FindData) {
            return res.status(400).send({
                success: false,
                message: 'ExcelSheet Data Can Not Found..'
            });
        }

        // Update the data
        const UpdatData = await ExcelSheetDataModel.findByIdAndUpdate(
            id,
            {
                reschedualDate,
                reschedualTime,  // Store the time as a string, no need for date manipulation
                callNotes,
                lastModified: Date.now(),
            },
            { new: true }
        );

        return res.status(200).send({
            success: true,
            message: 'Reschedual Successfully..',
            Data: UpdatData
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

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


module.exports = {
    AddExcelFile, AddManually, GetAllData, StartCall, DNDMode, PauseCall, Delete, LatestInfo, CallHistory, Reschedual
};