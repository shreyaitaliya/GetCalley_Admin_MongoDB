const mongoose = require('mongoose');

const smshistorySchema = new mongoose.Schema({
    excelfileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SMSModel',
        required: false
    },
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
        required: false
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SMSHistoryModel = mongoose.model('smsHistory', smshistorySchema);

module.exports = { SMSHistoryModel };
