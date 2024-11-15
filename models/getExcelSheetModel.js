const mongoose = require('mongoose');

const ExcelSheetDataSchema = new mongoose.Schema({
    excelfileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExcelModel',
        required: false
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
    agentName: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    callStartTime: {
        type: Date
    },
    callEndTime: {
        type: Date
    },
    callDate: {
        type: Date,
        require: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

const ExcelSheetDataModel = mongoose.model('ExcelSheetDataModel', ExcelSheetDataSchema);

module.exports = ExcelSheetDataModel;
