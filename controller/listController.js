const { ListModel } = require('../models/ListModel');
const ExcelSheetDataModel = require('../models/getExcelSheetModel');
const ExcelSheetDataHistoryModel = require('../models/getExcelSheetHistoryModel');
const XLSX = require('xlsx');
const fs = require('fs');

const AddList = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload an Excel file." });
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const fileData = {
            listname: req.body.listname,
            excelfile: req.file.filename,
            createdBy: req.company.name,
        };

        // Save the uploaded file info to ExcelModel
        const savedFile = await ListModel.create(fileData);

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
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = ({
    AddList
})