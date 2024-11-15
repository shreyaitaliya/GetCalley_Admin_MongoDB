const mongoose = require('mongoose');

const excelfileSchema = new mongoose.Schema({
    excelfile: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

const ExcelModel = mongoose.model('ExcelFile', excelfileSchema);

module.exports = { ExcelModel };
