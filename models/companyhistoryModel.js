const mongoose = require('mongoose');

const companyhistorySchema = new mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'company',
    },
    BackupCreatedBy: {
        type: String,
        required: true,
    },
    BackupCreatedOn: {
        type: Date,
        default: Date.now,
    },
});

const CompanyhistoryModel = mongoose.model('Companyhistory', companyhistorySchema);

module.exports = { CompanyhistoryModel };