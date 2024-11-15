const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyID: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
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
    createdBy: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    lastModifiedBy: {
        type: String,
        default: null,
    },
    lastModifiedOn: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const CompanyModel = mongoose.model('Company', companySchema);

module.exports = { CompanyModel };