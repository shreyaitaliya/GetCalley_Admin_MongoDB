const mongoose = require('mongoose');

const ExcelSheetDatahistorySchema = new mongoose.Schema({
    GetexcelDataID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExcelSheetDataModel',
        required: false
    },
    excelfileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExcelModel',
        required: false
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'list', // Referencing the 'list' collection
        required: true,
    },
    Name: {
        type: String,
        required: true
    },
    Contact: {
        type: String,
        required: true
    },
    Notes: {
        type: String,
        required: true
    },
    dnd: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Called'],
        default: 'Pending',
        required: false
    },
    feedback: {
        type: String,
        trim: true
    },
    callNotes: {
        type: String,
        trim: true
    },
    agentNamebackup: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const ExcelSheetDataModel = mongoose.model('ExcelSheetDatahistory', ExcelSheetDatahistorySchema);

module.exports = ExcelSheetDataModel;
