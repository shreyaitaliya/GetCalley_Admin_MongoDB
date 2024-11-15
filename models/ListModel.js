const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    listname: {
        type: String,
        required: true,
    },
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

const ListModel = mongoose.model('list', listSchema);

module.exports = { ListModel };
