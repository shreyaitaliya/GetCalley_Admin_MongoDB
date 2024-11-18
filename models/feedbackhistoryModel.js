const mongoose = require('mongoose');

const feedbackhistorySchema = new mongoose.Schema({
    excelfileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedbackModel',
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

const FeedbackHistoryModel = mongoose.model('feedbackHistory', feedbackhistorySchema);

module.exports = { FeedbackHistoryModel };
