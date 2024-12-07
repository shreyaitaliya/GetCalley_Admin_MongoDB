const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
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
    image: {
        type: String,
        require: true,
    },
    role: {
        type: Number,
        default: 1,
        enum: [1, 2], // 1 for company 2 for agent
        required: false
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

const CompanyModel = mongoose.model('Company', companySchema);

module.exports = { CompanyModel };
